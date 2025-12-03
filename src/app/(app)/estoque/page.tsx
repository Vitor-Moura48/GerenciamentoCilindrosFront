
"use client";

import { useState } from "react"; 

import { useSession } from "next-auth/react";

import { useEstoque, TabelaEstoqueItem } from "@/hooks/useStock";

import Table, { ColumnDefinition } from "@/hooks/Table";

import Modal from "@/components/Modal";

import Button from "@/components/Button";

import LoadingSpinner from "@/components/LoadingSpinner";



const Input = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => ( <div> <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label> <input className="w-full border rounded px-3 py-2 text-gray-800 bg-white" {...props} /> </div> );

const ErrorMessage = ({ message }: { message: string }) => <div className="p-10 text-center text-red-600">Erro ao carregar: {message}</div>;



interface NewCylinderFormState { codigo_serial: string; capacidade: string; pressao_maxima: string; pressao_atual: string; id_setor: string; }

const INITIAL_FORM_STATE: NewCylinderFormState = { codigo_serial: '', capacidade: '', pressao_maxima: '', pressao_atual: '', id_setor: '', };



export default function EstoquePage() {

    const { data: session } = useSession();
    const userId = session?.user?.id; 

    const { dados, isLoading, error, updateCylinderStatus, setores, addCylinder } = useEstoque();



    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [editData, setEditData] = useState<TabelaEstoqueItem | null>(null);



    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [newCylinderForm, setNewCylinderForm] = useState<NewCylinderFormState>(INITIAL_FORM_STATE);

    const [formError, setFormError] = useState<string | null>(null);



    const columns: ColumnDefinition<TabelaEstoqueItem>[] = [

        { header: "Código Serial", accessorKey: "codigo_serial" },

        { header: "Setor", accessorKey: "setor" },

        { header: "Status", accessorKey: "status" },

        { header: "Matrícula", accessorKey: "matricula" },

    ];



    const handleRowClick = (row: TabelaEstoqueItem) => {

        setEditData({ ...row });

        setIsEditModalOpen(true);

    };



    const handleEditChange = (field: keyof TabelaEstoqueItem, value: string) => {

        if (editData) setEditData({ ...editData, [field]: value });

    };



    const handleSave = async () => {

        if (!editData) return;

        try {

            const novoStatus = editData.status === "Em uso";

            await updateCylinderStatus(editData.id, novoStatus);

            setIsEditModalOpen(false);

        } catch (apiError) {

            console.error("Falha ao salvar:", apiError);

            alert("Não foi possível salvar as alterações. Tente novamente.");

        }

    };



    const handleOpenAddModal = () => {

        if (setores && setores.length > 0) {

            setNewCylinderForm({

                ...INITIAL_FORM_STATE,

                id_setor: String(setores[0].id_setor)

            });

        } else {

            setNewCylinderForm(INITIAL_FORM_STATE);

        }

        setFormError(null);

        setIsAddModalOpen(true);

    };



    const handleAddFormChange = (field: keyof NewCylinderFormState, value: string) => {

        setNewCylinderForm(prev => ({ ...prev, [field]: value }));

    };



    const handleAddSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        setFormError(null);



        if (!userId) {

            setFormError("Usuário não autenticado. Faça login novamente.");

            return;

        }


        const idSetorNumerico = Number(newCylinderForm.id_setor);

        if (!newCylinderForm.codigo_serial || !idSetorNumerico || idSetorNumerico === 0) {

            setFormError("Código Serial e um Setor válido são obrigatórios.");

            return;

        }



        try {

            await addCylinder({

                codigo_serial: newCylinderForm.codigo_serial,

                capacidade: Number(newCylinderForm.capacidade) || 0,

                pressao_maxima: Number(newCylinderForm.pressao_maxima) || 0,

                id_setor: idSetorNumerico,

                pressao_atual: Number(newCylinderForm.pressao_atual) || 0,

            }, Number(userId));

            setIsAddModalOpen(false);

        } catch (apiError: unknown) {

            if (apiError instanceof Error) {
                setFormError(apiError.message);
            } else {
                setFormError("Ocorreu um erro desconhecido.");
            }
        }

    };



    if (isLoading && dados.length === 0) {

        return (

            <div className="flex justify-center items-center p-10">

                <LoadingSpinner size={48} />

            </div>

        );

    };
    if (error) return <ErrorMessage message={error.message} />;

    return (
        <div className="p-6 flex justify-center">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-700">Estoque de Cilindros</h2>
                <Table
                    data={dados}
                    columns={columns}
                    enableRowClick
                    onRowClick={handleRowClick}
                    onAddRecord={handleOpenAddModal}
                    isAddRecordDisabled={setores.length === 0}
                />
            </div>

            {/* Modal de Edição */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                {editData && (
                    <form
                        className="flex flex-col items-center justify-center text-black space-y-6 p-4"
                        onSubmit={(e) => { e.preventDefault(); handleSave(); }}
                    >
                        <h3 className="text-xl font-semibold">
                            Editar Status do Cilindro #{editData?.codigo_serial}
                        </h3>
                        <div className="flex items-center">
                            <label className="font-semibold min-w-[70px] text-right mr-2">Status:</label>
                            <select
                                className="border rounded px-2 py-1 text-center w-40 bg-white"
                                value={editData.status}
                                onChange={(e) => handleEditChange("status", e.target.value)}
                            >
                                <option value="Disponível">Disponível</option>
                                <option value="Em uso">Em uso</option>
                            </select>
                        </div>
                        <Button
                            type="submit"
                            className="w-full cursor-pointer text-white bg-[#1F384C] py-2 px-3 rounded-sm hover:opacity-90"
                        >
                            Salvar Alterações
                        </Button>
                    </form>
                )}
            </Modal>

            {/* Modal de Adição */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                <form className="flex flex-col text-black space-y-4 p-4 w-full max-w-sm mx-auto" onSubmit={handleAddSubmit}>
                    <h3 className="text-xl font-semibold text-center mb-2">Registrar Novo Cilindro</h3>
                    <Input label="Código Serial *" value={newCylinderForm.codigo_serial} onChange={e => handleAddFormChange('codigo_serial', e.target.value)} />
                    <Input label="Capacidade" type="number" value={newCylinderForm.capacidade} onChange={e => handleAddFormChange('capacidade', e.target.value)} />
                    <Input label="Pressão Máxima" type="number" value={newCylinderForm.pressao_maxima} onChange={e => handleAddFormChange('pressao_maxima', e.target.value)} />
                    <Input label="Pressão Atual" type="number" value={newCylinderForm.pressao_atual} onChange={e => handleAddFormChange('pressao_atual', e.target.value)} />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Setor *</label>
                        <select
                            value={newCylinderForm.id_setor}
                            onChange={e => handleAddFormChange('id_setor', e.target.value)}
                            className="w-full border rounded px-3 py-2 bg-white"
                        >
                            <option value="" disabled>Selecione um setor</option>
                            {setores.map(setor => (
                                <option key={setor.id_setor} value={setor.id_setor}>{setor.setor}</option>
                            ))}
                        </select>
                    </div>
                    {formError && <p className="text-red-600 text-sm text-center">{formError}</p>}
                    <Button
                        type="submit"
                        className="w-full cursor-pointer text-white bg-[#1F384C] py-2 px-3 rounded-sm hover:opacity-90 mt-4"
                    >
                        Adicionar Registro
                    </Button>
                </form>
            </Modal>
        </div>
    );
}