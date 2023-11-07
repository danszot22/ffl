import { useState, useCallback } from 'react';

function useTableLoader(loader, mapper) {
    //table state
    const [prevSorting, setPrevSorting] = useState([]);
    const [prevColumnFilters, setPrevColumnFilters] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [endCursor, setEndCursor] = useState("");

    //data and fetching state
    const [fetchedData, setFetchedData] = useState([]);
    const [displayedData, setDisplayedData] = useState([]);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);
    const [rowCount, setRowCount] = useState(2 * pagination.pageSize);

    const loadTableWithData = useCallback(async () => {

        const filterColumnsChanged = (arr1, arr2) => {
            return (arr1.length !== arr2.length) || arr1.some((column, index) => column.id !== arr2[index].id || column.value !== arr2[index].value);
        }

        const sortColumnsChanged = (arr1, arr2) => {
            return (arr1.length !== arr2.length) || arr1.some((column, index) => column.id !== arr2[index].id || column.desc !== arr2[index].desc);
        }

        const getPreviouslyFetchedData = ({ pageIndex, pageSize }) => {
            return fetchedData.slice((pageIndex) * pageSize, (pageIndex + 1) * pageSize);
        }

        const filtersChanged = filterColumnsChanged(columnFilters, prevColumnFilters);
        const sortingChanged = sortColumnsChanged(sorting, prevSorting);

        if (filtersChanged || sortingChanged) {
            setFetchedData([]);
            setDisplayedData([]);
            setPagination({
                pageIndex: 0,
                pageSize: 10,
            });
            setRowCount(2 * pagination.pageSize);
            setEndCursor('');
            setIsLoading(true);
        }

        if (!fetchedData.length) {
            setIsLoading(true);
        } else {
            setIsRefetching(true);
        }

        try {
            if (sortingChanged || filtersChanged || fetchedData.length <= pagination.pageIndex * pagination.pageSize) {
                const results = await loader({ pagination, columnFilters, globalFilter, endCursor, sorting }, !(filtersChanged || sortingChanged));

                if (results) {
                    if (results.items.length > 0) {
                        const items = mapper(results.items);
                        setDisplayedData(items);
                        setEndCursor(results.endCursor);
                        if (filtersChanged || sortingChanged)
                            setFetchedData(items);
                        else
                            setFetchedData(fetchedData.length ? fetchedData.concat(items) : items);
                    }
                    if (!results.hasNextPage)
                        setRowCount(fetchedData.length + results.items.length);
                    else
                        setRowCount((pagination.pageIndex + 2) * pagination.pageSize);
                }
            }
            else {
                setDisplayedData(getPreviouslyFetchedData(pagination));
            }
        } catch (error) {
            setIsError(true);
            console.error(error);
            return;
        }
        setIsError(false);
        setIsLoading(false);
        setIsRefetching(false);
        setPrevColumnFilters(columnFilters);
        setPrevSorting(sorting);
    }, [columnFilters, prevColumnFilters, sorting, prevSorting, endCursor, fetchedData, globalFilter, pagination, loader, mapper]);

    return {
        displayedData, setDisplayedData, loadTableWithData, setPrevColumnFilters, rowCount, isError, isLoading, isRefetching, columnFilters, globalFilter, setColumnFilters, setGlobalFilter, pagination, setPagination, sorting, setSorting,
    }
}

export default useTableLoader;

