import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/Auth/AuthContext.tsx";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import {
    Box,
    Card,
    CardContent, Checkbox, Chip, CircularProgress, Divider,
    FormControl,
    InputLabel, ListItemText, MenuItem,
    Select,
    SelectChangeEvent,
    Typography
} from "@mui/material";
import AdminSidenavComponent from "../../shared/AdminSidenavComponent";
import { LineChart } from "@mui/x-charts";
import { MonetizationOnOutlined, Person, ShoppingBagRounded } from "@mui/icons-material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { useApi } from "../../hooks/useApi.ts";

interface AdminDashboardPageProps {}

const styles = {
    formControl: {
        minWidth: 250,
        '& .MuiInputLabel-root': {
            backgroundColor: 'white',
            padding: '0 4px',
            transform: 'translate(14px, -9px) scale(0.75)',
            '&.Mui-focused': {
                color: 'primary.main',
            },
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderWidth: '1px',
            },
            '&:hover fieldset': {
                borderWidth: '1px',
            },
        },
    },
    chartContainer: {
        position: 'relative',
        '& .MuiChartsLegend-root': {
            paddingTop: '30px !important',
        }
    },
};

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = () => {
    const auth = useContext(AuthContext);
    const api = useApi();
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<{
        currentMonthSalesTotal: number;
        currentMonthRegisteredUsers: number;
        todaySalesCount: number;
    } | null>(null);
    const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(dayjs()); // hoje
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(
        dayjs().subtract(1, 'year') // 1 ano atrás da data final
    );
    const [salesByCategoryData, setSalesByCategoryData] = useState<any[]>([]);

    dayjs.locale('pt-br');

    // Filtra e transforma os dados para o gráfico usando resposta do backend
    const { series, xAxis } = React.useMemo(() => {
        if (!salesByCategoryData.length) return { series: [], xAxis: [] };

        const xAxisLabels = salesByCategoryData.map((item: any) => item.monthLabel);

        const seriesData = selectedCategories.map((categoryName) => ({
            label: categoryName,
            data: salesByCategoryData.map((month: any) => {
                const cat = month.categories.find(
                    (c: any) => c.categoryName === categoryName
                );
                return cat ? cat.totalSalesAmount : 0;
            }),
            showMark: true,
        }));

        return {
            series: seriesData,
            xAxis: xAxisLabels,
        };
    }, [selectedCategories, salesByCategoryData]);

    const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
        const value = event.target.value;
        setSelectedCategories(typeof value === 'string' ? value.split(',') : value);
    };

    // Busca categorias e resumo ao carregar o componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [categoriesResponse, summaryResponse] = await Promise.all([
                    api.listAllProductCategories(),
                    api.getAdminDashboardSummary()
                ]);

                const categoriesList = categoriesResponse.data.map((cat: { name: string }) => cat.name);
                setCategories(categoriesList);

                if (categoriesList.length > 0) {
                    setSelectedCategories(categoriesList.slice(0, 3));
                }

                if (summaryResponse?.data && summaryResponse.data.length > 0) {
                    setSummary(summaryResponse.data[0]);
                }
            } catch (error) {
                console.error("Erro ao carregar dados");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Busca dados do gráfico sempre que o intervalo de datas mudar
    useEffect(() => {
        const fetchSalesByCategory = async () => {
            if (!startDate || !endDate) return;

            try {
                const start = startDate.startOf('month').format('YYYY-MM-DD');
                const end = endDate.endOf('month').format('YYYY-MM-DD');

                const response = await api.getAdminDashboardSalesByCategory(start, end);
                setSalesByCategoryData(response.data || []);
            } catch (error) {
                console.error("Erro ao carregar vendas por categoria");
                setSalesByCategoryData([]);
            }
        };

        fetchSalesByCategory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Grid2 container xs={12}>
            <Grid2 xs={12} sx={{ pl: 32, mt: 5 }}>
                <Typography fontFamily={'Public Sans'} fontSize={40} sx={{ mb: 5, ml: 4 }}>
                    Bem vindo, {auth.user?.fullName.split(" ")[0]}!
                </Typography>
            </Grid2>
            <AdminSidenavComponent />
            <Grid2 xs={10} sx={{ display: "flex", gap: 5, p: 3, flexWrap: "wrap", maxWidth: 2000 }}>
                <Card sx={{ display: "flex", flexDirection: "column", width: 300, p: 2, borderRadius: 4 }}>
                    <Box sx={{ width: "100%", justifyContent: 'space-between' }}>
                        <MonetizationOnOutlined sx={{ fontSize: 50 }} />
                    </Box>
                    <CardContent>
                        <Typography fontFamily={'Public Sans'} fontSize={30}>
                            {summary
                                ? `R$ ${summary.currentMonthSalesTotal.toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}`
                                : "R$ 0,00"}
                        </Typography>
                        <Typography fontFamily={'Public Sans'} fontSize={17}>
                            Valor total de vendas neste mês
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{ display: "flex", flexDirection: "column", width: 300, p: 2, borderRadius: 4 }}>
                    <Box sx={{ width: "100%", justifyContent: 'space-between' }}>
                        <Person sx={{ fontSize: 50 }} />
                    </Box>
                    <CardContent>
                        <Typography fontFamily={'Public Sans'} fontSize={30}>
                            {summary ? summary.currentMonthRegisteredUsers.toLocaleString('pt-BR') : 0}
                        </Typography>
                        <Typography fontFamily={'Public Sans'} fontSize={17}>
                            Usuários registrados neste mês
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{ display: "flex", flexDirection: "column", width: 300, p: 2, borderRadius: 4 }}>
                    <Box sx={{ width: "100%", justifyContent: 'space-between' }}>
                        <ShoppingBagRounded sx={{ fontSize: 50 }} />
                    </Box>
                    <CardContent>
                        <Typography fontFamily={'Public Sans'} fontSize={30}>
                            {summary ? summary.todaySalesCount.toLocaleString('pt-BR') : 0}
                        </Typography>
                        <Typography fontFamily={'Public Sans'} fontSize={17}>
                            Vendas realizadas hoje
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{ p: 3, borderRadius: 4, width: '80%' }}>
                    <Typography variant="h5" gutterBottom>
                        Comparativo de Vendas por Categoria
                    </Typography>
                    <Divider/>
                    {/* Controles de Filtro */}
                    <Box sx={{ display: 'flex', gap: 3, mb: 4, mt:4, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                            <DatePicker
                                label="Data Inicial"
                                value={startDate}
                                onChange={(date) => {
                                    setStartDate(date)
                                }}
                                format="DD/MM/YYYY"
                                sx={{ width: 180 }}
                            />
                            <DatePicker
                                label="Data Final"
                                value={endDate}
                                onChange={(date) => {
                                    setEndDate(date)
                                }}
                                format="DD/MM/YYYY"
                                sx={{ width: 180 }}
                            />
                        </LocalizationProvider>

                        <FormControl sx={styles.formControl}>
                            <InputLabel shrink>Categorias</InputLabel>
                            <Select
                                multiple
                                value={selectedCategories}
                                onChange={handleCategoryChange}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} size="small" />
                                        ))}
                                    </Box>
                                )}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 300,
                                        },
                                    },
                                }}
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category} value={category}>
                                        <Checkbox checked={selectedCategories.includes(category)} />
                                        <ListItemText primary={category} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Gráfico */}
                    <CardContent sx={styles.chartContainer}>
                        {series.length > 0 ? (
                            <LineChart
                                xAxis={[{
                                    data: xAxis,
                                    scaleType: 'band',
                                    label: 'Mês/Ano',
                                    labelStyle: {
                                        fontSize: 12,
                                        transform: 'translateY(20px)',
                                    },
                                }]}
                                yAxis={[{
                                    valueFormatter: (value) => `R$ ${value.toLocaleString('pt-BR', { 
                                        minimumFractionDigits: 2, 
                                        maximumFractionDigits: 2 
                                    })}`,
                                    labelStyle: {
                                        fontSize: 12,
                                        transform: 'translateX(-20px)',
                                    },
                                }]}
                                series={series}
                                height={400}
                                margin={{ top: 30, bottom: 100, left: 100, right: 30 }}
                                slotProps={{
                                    legend: {
                                        direction: 'row',
                                        position: { vertical: 'bottom', horizontal: 'middle' },
                                        itemMarkWidth: 8,
                                        itemMarkHeight: 8,
                                        labelStyle: {
                                            fontSize: 12,
                                        },
                                        padding: { top: 30 },
                                    },
                                }}
                            />
                        ) : (
                            <Typography variant="body1" color="textSecondary" textAlign="center">
                                Nenhum dado disponível para o período selecionado
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Grid2>
        </Grid2>
    );
};

export default AdminDashboardPage;