export interface Obra {
    id: string;
    userId: string;
    status: boolean;
    title: string;
    description?: string;
    initial_budget: number;
    executed_budget: number;
    allocated_budget: number;
}