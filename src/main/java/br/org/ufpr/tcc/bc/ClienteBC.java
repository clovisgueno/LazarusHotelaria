package br.org.ufpr.tcc.bc;

import java.util.List;
import java.util.logging.Logger;

import br.org.ufpr.tcc.ClienteDAO;
import br.org.ufpr.tcc.dto.ClienteDTO;
import br.org.ufpr.tcc.dto.ClienteFiltroDTO;
import br.org.ufpr.tcc.dto.ResponseDTO;
import br.org.ufpr.tcc.dto.ResultadoPaginadoDTO;
import br.org.ufpr.tcc.entity.Cliente;
import br.org.ufpr.tcc.entity.Pagina;
import java.util.logging.Level;

public class ClienteBC {

    private Logger log = Logger.getLogger(this.getClass().getCanonicalName());

    private ClienteDAO dao = new ClienteDAO();

    public Cliente obter(Long id) {
        return dao.obter(id);
    }

    public ResultadoPaginadoDTO<Cliente> listar(ClienteFiltroDTO filtros) throws Exception {

        String logMsg = "Iniciando a listagens de Cliente BC";
        log.info(logMsg);

        List<Cliente> lista = dao.listar(filtros);

        return new ResultadoPaginadoDTO<Cliente>(lista, new Pagina());
    }

    public ResponseDTO persistir(Cliente cliente) {
        String descricaoOperacao = "";

        //VALIDAR A ENTIDADE ANTES DE PERSISTIR
        if (cliente.getId() == null) {
            log.info("Inicia a persistência de um novo cliente.");
            dao.inserir(cliente);
            log.info("Persistiu novo cliente na base de dados.");

        } else {
            log.info("Inicia a atualização do cliente [id=%d]" + cliente.getId());

            try {
                //TODO: PENDENTE
                dao.alterar(cliente);
            } catch (Exception ex) {
                Logger.getLogger(ClienteBC.class.getName()).log(Level.SEVERE, "Erro ao alterar.", ex);
            }
            log.info("Alterou cliente na base de dados.");
        }

        return new ResponseDTO();
    }

    public ResponseDTO remover(Long[] ids) {
        // TODO Auto-generated method stub
        return null;
    }

}
