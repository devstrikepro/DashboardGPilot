import { useState } from "react";

export type AccountTradeType = "ALL" | "Trade" | "Deposit" | "ProfitShare" | "Withdraw";

export function useAccountTable() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [typeFilter, setTypeFilter] = useState<AccountTradeType>("ALL");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleRowsPerPageChange = (value: number) => {
        setRowsPerPage(value);
        setPage(0);
    };

    const handleTypeFilterChange = (value: AccountTradeType) => {
        setTypeFilter(value);
        setPage(0);
    };

    const handleStartDateChange = (value: string) => {
        setStartDate(value);
        setPage(0);
    };

    const handleEndDateChange = (value: string) => {
        setEndDate(value);
        setPage(0);
    };

    return {
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage: handleRowsPerPageChange,
        typeFilter,
        setTypeFilter: handleTypeFilterChange,
        startDate,
        setStartDate: handleStartDateChange,
        endDate,
        setEndDate: handleEndDateChange,
    };
}

