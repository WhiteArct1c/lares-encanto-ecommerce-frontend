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

// Tipos e dados
interface ChartData {
    date: Date;
    value: number;
    category: string;
}

const generateMockData = () => {
    const mockData: ChartData[] = [];
    const categories: string[] = [
        "Cozinha",
        "Quarto",
        "Banheiro",
        "Sala de Estar",
        "Sala de Jantar"
    ]

    // Gera dados para 2023 e 2024
    for (let year = 2023; year <= 2024; year++) {
        for (let month = 0; month < 12; month++) {
            categories.forEach(category => {
                // Valores base diferentes para cada categoria
                let baseValue = 0;
                switch(category) {
                    case "Quarto":
                        baseValue = 15000;
                        break;
                    case "Banheiro":
                        baseValue = 10000;
                        break;
                    case "Sala de Estar":
                        baseValue = 8000;
                        break;
                    case "Cozinha":
                        baseValue = 6000;
                        break;
                    case "Sala de Jantar":
                        baseValue = 5000;
                        break;
                }

                // Variação sazonal + aleatoriedade
                const seasonalVariation = Math.sin(month * 0.5) * 0.3 + 1;
                const randomFactor = 0.8 + Math.random() * 0.4;
                const value = Math.round(baseValue * seasonalVariation * randomFactor);

                mockData.push({
                    date: new Date(year, month, 15), // Dia 15 de cada mês
                    value: value,
                    category: category
                });
            })
        }
    }

    return mockData;
};

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = () => {
    const auth = useContext(AuthContext);
    const api = useApi();
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState<dayjs.Dayjs>(dayjs(new Date(2023, 0, 15)));
    const [endDate, setEndDate] = useState<dayjs.Dayjs>(dayjs(new Date(2024, 11, 15)));
    const [chartData, setChartData] = useState<ChartData[]>(generateMockData());

    dayjs.locale('pt-br');

    // Filtra e transforma os dados para o gráfico
    const { series, xAxis } = React.useMemo(() => {
        if (!chartData.length) return { series: [], xAxis: [] };

        // Filtra por data
        const dateFiltered = chartData.filter(item =>
            dayjs(item.date).isAfter(startDate?.subtract(1, 'day') || dayjs('1970-01-01')) &&
            dayjs(item.date).isBefore(endDate?.add(1, 'day') || dayjs('2100-01-01'))
        );

        // Agrupa por mês e categoria
        const grouped: Record<string, Record<string, number>> = {};

        dateFiltered.forEach(item => {
            const month = dayjs(item.date).format('MMM/YYYY').toUpperCase();
            if (!grouped[month]) grouped[month] = {};
            grouped[month][item.category] = (grouped[month][item.category] || 0) + item.value;
        });

        // Prepara as séries para cada categoria selecionada
        const seriesData = selectedCategories.map(category => ({
            label: category,
            data: Object.keys(grouped).map(month => grouped[month][category] || 0),
            showMark: true,
        }));

        return {
            series: seriesData,
            xAxis: Object.keys(grouped)
        };
    }, [selectedCategories, startDate, endDate, chartData]);

    const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
        const value = event.target.value;
        setSelectedCategories(typeof value === 'string' ? value.split(',') : value);
    };

    // Busca categorias ao carregar o componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Busca categorias
                const categoriesResponse = await api.listAllProductCategories();
                const categoriesList = categoriesResponse.data.map((cat: { name: string }) => cat.name);
                setCategories(categoriesList);

                // Seleciona as 2 primeiras categorias por padrão
                if (categoriesList.length > 0) {
                    setSelectedCategories(categoriesList.slice(0, 3));
                }
            } catch (error) {
                console.error("Erro ao carregar dados");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
                            R$ 1.298.998,00
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
                            12.523
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
                            100
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
                                onChange={setStartDate}
                                format="DD/MM/YYYY"
                                sx={{ width: 180 }}
                            />
                            <DatePicker
                                label="Data Final"
                                value={endDate}
                                onChange={setEndDate}
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