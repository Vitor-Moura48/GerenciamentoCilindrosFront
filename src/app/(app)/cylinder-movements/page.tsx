"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMovimentacoes, TabelaMovimentacaoItem } from "@/hooks/useCylinderMovements";
import Table, { ColumnDefinition } from "@/hooks/Table";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import LoadingSpinner from "@/components/LoadingSpinner"; 

const ErrorMessage = ({ message }: { message: string }) => <div className="p-10 text-center text-red-600">Erro: {message}</div>;

interface NewMovimentacaoForm {
    codigo_serial: string;
    id_setor: string;
    pressao: string;
    percentual_respirador: string;
}

const INITIAL_FORM_STATE: NewMovimentacaoForm = {
    codigo_serial: '',
    id_setor: '',
    pressao: '',
    percentual_respirador: '',
};

export default function MovimentacaoPage() {
    const { data: session } = useSession();
    const userId = session?.user?.id; 

    const { dados, isLoading, error, setores, addMovimentacao } = useMovimentacoes();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formState, setFormState] = useState<NewMovimentacaoForm>(INITIAL_FORM_STATE);
    const [formError, setFormError] = useState<string | null>(null);

    // Definição das colunas para a tabela dinâmica
    const columns: ColumnDefinition<TabelaMovimentacaoItem>[] = [
        { header: "Código Serial", accessorKey: "codigo_serial" },
        { header: "Destino", accessorKey: "destino" },
        { header: "Pressão", accessorKey: "pressao" },
        { header: "Percentual Respirador", accessorKey: "percentual_respirador" },
        { header: "Matrícula", accessorKey: "matricula" },
        { header: "Data do Consumo", accessorKey: "data_consumo" },
    ];

    const handleOpenModal = () => {
        if (setores.length > 0) {
            setFormState({ ...INITIAL_FORM_STATE, id_setor: String(setores[0].id_setor) });
        } else {
            setFormState(INITIAL_FORM_STATE);
        }
        setFormError(null);
        setIsModalOpen(true);
    };

    const handleChange = (field: keyof NewMovimentacaoForm, value: string) => {
        setFormState(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        if (!userId) {
            setFormError("Usuário não autenticado.");
            return;
        }

        try {
            await addMovimentacao({
                codigo_serial: formState.codigo_serial,
                id_setor: Number(formState.id_setor),
                pressao: Number(formState.pressao),
                percentual_respirador: Number(formState.percentual_respirador),
            }, Number(userId));
            setIsModalOpen(false);
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
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-700">Movimentação de Cilindros</h2>
                <Table
                    data={dados} 
                    columns={columns}
                    onAddRecord={handleOpenModal}
                    isAddRecordDisabled={setores.length === 0}
                    addRecordButtonText={"Adicionar Registro"}
                />
            </div>

            {/* Modal de Adição */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form className="flex flex-col text-black space-y-4 p-4 w-full max-w-sm mx-auto" onSubmit={handleSubmit}>
                    <h3 className="text-xl font-semibold text-center mb-2">Registrar Movimentação</h3>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Código Serial do Cilindro *</label>
                        <input
                            type="text"
                            placeholder="Código Serial"
                            className="w-full border border-gray-300 p-2 rounded-md text-black"
                            name={"codigo_serial"}
                            value={formState.codigo_serial}
                            onChange={e => handleChange('codigo_serial', e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Setor de Destino *</label>
                        <select 
                            value={formState.id_setor} 
                            onChange={e => handleChange('id_setor', e.target.value)} 
                            className="w-full border rounded px-3 py-2 bg-white"
                        >
                            {setores.map(setor => (
                                <option key={setor.id_setor} value={setor.id_setor}>{setor.setor}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pressão *</label>
                        <input
                            type="number"
                            placeholder="Pressão"
                            className="w-full border border-gray-300 p-2 rounded-md text-black"
                            name={"pressao"}
                            value={formState.pressao}
                            onChange={e => handleChange('pressao', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Percentual Respirador *</label>
                        <input
                            type="number"
                            placeholder="Percentual Respirador"
                            className="w-full border border-gray-300 p-2 rounded-md text-black"
                            name={"percentual_respirador"}
                            value={formState.percentual_respirador}
                            onChange={e => handleChange('percentual_respirador', e.target.value)}
                        />
                    </div>

                    {formError && <p className="text-red-600 text-sm text-center">{formError}</p>}
                    <Button type="submit" className="w-full cursor-pointer text-white bg-[#1F384C] py-2 px-3 rounded-sm hover:opacity-90 mt-4">
                        Adicionar Registro
                    </Button>
                </form>
            </Modal>
        </div>
    );
}