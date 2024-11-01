import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Search,
  Refresh,
  Add,
  MoreVert,
  Edit,
  Delete,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const url = "http://localhost:5000/clientes";

const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);

  const navigate = useNavigate();

  const fetchClientes = async () => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      setClientes(data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleOpenMenu = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuRowId(id);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuRowId(null);
  };

  const handleDeleteCliente = async (id) => {
    try {
      await fetch(`${url}/${id}`, { method: "DELETE" });
      setClientes((prev) => prev.filter((cliente) => cliente.id !== id));
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
    }
  };

  const columns = [
    { field: "codigo", headerName: "Código", width: 100 },
    { field: "nome", headerName: "Nome", width: 150 },
    { field: "cpfCnpj", headerName: "CPF/CNPJ", width: 150 },
    { field: "cidade", headerName: "Cidade", width: 150 },
    { field: "telefone", headerName: "Telefone", width: 150 },
    {
      field: "actions",
      headerName: "Ações",
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
            <MenuItem
              onClick={() => {
                navigate(`/clientes/cadastro/${params.row.id}`);
                handleCloseMenu();
              }}
            >
              <Edit fontSize="small" /> Editar
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleDeleteCliente(params.row.id);
                handleCloseMenu();
              }}
            >
              <Delete fontSize="small" /> Excluir
            </MenuItem>
          </Menu>
        </>
      ),
    },
  ];

  return (
    <div style={{
      margin: "24px",
      maxWidth: "1100px",
      justifySelf: "center"
    }}>
      <Paper elevation={1} sx={{ p: 2 }}>

        <Container sx={{ p: 2 }}>
          <div className="hearder" style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            marginBottom: "3px",
          }}>
            <Typography variant="h4" gutterBottom sx={{ marginBottom: "0" }}>
              Clientes
            </Typography>
            <IconButton color="primary" onClick={fetchClientes}>
              <Refresh />
            </IconButton>
          </div>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom={2}
            gap={3}
          >
            <TextField
              variant="outlined"
              placeholder="Pesquisar por nome, CPF ou CNPJ..."
              InputProps={{
                startAdornment: <Search />,
              }}
              sx={{ width: "100%", maxWidth: "400px" }}
            />

            <Box>
              <Button
                variant="contained"
                color="primary"
                sx={{ height: "56px", width: "100%" }}
                startIcon={<Add />}
                onClick={() => navigate("/clientes/cadastro")}
              >
                Incluir cliente
              </Button>
            </Box>
          </Box>
        </Container>
        <Container maxWidth="lg" sx={{ padding: 2 }}>

          <Box sx={{ height: 400, width: "100%", backgroundColor: "white" }}>
            <DataGrid rows={clientes} columns={columns} pageSize={5} />
          </Box>
        </Container>
      </Paper>
    </div>
  );
};

export default ClientesPage;
