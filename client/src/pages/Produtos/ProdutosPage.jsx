import React, { useState, useEffect } from 'react';
import {
  Box, Button, Container, IconButton, Menu, MenuItem, Select, TextField, Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Search, Add, FilterList, MoreVert, Edit, Delete, Inventory } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const url = "http://localhost:5000/produtos"; // URL para a API de produtos

const ProdutosPage = () => {
  const [produtos, setProdutos] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);

  const navigate = useNavigate();

  // Função para buscar produtos
  const fetchProdutos = async () => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      setProdutos(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  // Funções para abrir e fechar o menu de opções de ações
  const handleOpenMenu = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuRowId(id);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuRowId(null);
  };

  // Função para deletar um produto
  const handleDeleteProduto = async (id) => {
    try {
      await fetch(`${url}/${id}`, { method: "DELETE" });
      setProdutos(prev => prev.filter(produto => produto.id !== id));
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
    }
  };

  // Definição das colunas da tabela de produtos
  const columns = [
    { field: 'nome', headerName: 'Descrição', width: 200 },
    { field: 'codigo', headerName: 'Código', width: 150 },
    { field: 'unidade', headerName: 'Unidade', width: 100 },
    { field: 'preco', headerName: 'Preço', width: 100 },
    { field: 'estoque', headerName: 'Estoque', width: 100 },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            size="small"
            color="primary"
            onClick={(event) => handleOpenMenu(event, params.row.id)}
          >
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && menuRowId === params.row.id}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={() => {
              navigate(`/produtos/cadastro/${params.row.id}`);
              handleCloseMenu();
            }}>
              <Edit fontSize="small" /> Editar
            </MenuItem>
            <MenuItem onClick={() => { handleDeleteProduto(params.row.id); handleCloseMenu(); }}>
              <Delete fontSize="small" /> Excluir
            </MenuItem>
            <MenuItem onClick={() => {
              // Navegar para a página de estoques, passando o produto selecionado
              navigate(`/estoques/${params.row.id}`, { state: { produto: params.row } });
              handleCloseMenu();
            }}>
              <Inventory fontSize="small" /> Estoque
            </MenuItem>
          </Menu>
        </>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4, backgroundColor: "white", padding: 4, borderRadius: 1 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">Produtos</Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          color="primary"
          onClick={() => navigate('/produtos/cadastro')}
        >
          Incluir cadastro
        </Button>
      </Box>
      <Box display="flex" alignItems="center" gap={1} paddingBottom={3} >
          <TextField placeholder="Pesquisar por código, descrição" variant="outlined" size="small" sx={{ width: '100%' }}/>
          <IconButton color="primary">
            <Search />
          </IconButton>
        </Box>

      <Box height={400} sx={{ width: '100%' }}>
        <DataGrid
          rows={produtos}
          columns={columns}
          pageSize={10}
          // checkboxSelection
        />
      </Box>
    </Container>
  );
};

export default ProdutosPage;
