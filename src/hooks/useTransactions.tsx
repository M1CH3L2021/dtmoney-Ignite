import { createContext, ReactNode, useEffect, useState, useContext } from 'react'
import { api } from '../services/api'

interface Transaction {
    id: number;
    title: string;
    amount: number
    type: string;
    category: string;
    createdAt: string;
}

interface TransactionInput {
    title: string;
    amount: number
    type: string;
    category: string;
}

//type TransactionInput = Omit<Transaction, 'id' | 'createdAt'> // pega todos os valores do interface Transaction, com excessão de 'id' e 'createdAt'

// type TransactionInput = Pick<Transaction, 'id' | 'createdAt'> // pega apenas os valores 'id' e 'createdAt' do interface Transaction

interface ResponseData {
    transactions: Transaction[]
}

interface TransactionsProviderProps {
    children: ReactNode
}

interface TransactionsContextData {
    transactions: Transaction[];
    createTransaction: (transactionInput: TransactionInput) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextData>({} as TransactionsContextData)

export function TransactionsProvider({ children }: TransactionsProviderProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([])

    useEffect(() => {
        api.get('transactions')
        .then(response => {
            const {transactions} = response.data as ResponseData;
            setTransactions(transactions)
        })

    }, [])

    async function createTransaction(transactionInput: TransactionInput) {
        const response = await api.post('transactions', {
            ...transactionInput,
            createdAt: new Date()
        })
        const { transaction }: any = response.data

        setTransactions([...transactions, transaction])
    }

    return (
        <TransactionsContext.Provider value={{transactions, createTransaction}}>
            {children}
        </TransactionsContext.Provider>
    )
}

export function useTransactions() {
    const context = useContext(TransactionsContext)

    return context
}