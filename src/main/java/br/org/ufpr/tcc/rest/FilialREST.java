package br.org.ufpr.tcc.rest;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import org.apache.commons.io.IOUtils;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;

import br.org.ufpr.tcc.dto.FilialDTO;
import br.org.ufpr.tcc.dto.FilialFiltroDTO;
import br.org.ufpr.tcc.dto.FotoDTO;
import br.org.ufpr.tcc.dto.ResponseDTO;
import br.org.ufpr.tcc.dto.ResultadoPaginadoDTO;
import br.org.ufpr.tcc.facade.FilialFacade;
import br.org.ufpr.tcc.facade.FotoFacade;



@Path("/filial")
public class FilialREST {

	FilialFacade facade = new FilialFacade();
	FotoFacade fotoFacade = new FotoFacade();
	
	@GET
    @Path("{codFilial}")
    @Produces("application/json") 
    public FilialDTO obter(@PathParam("codFilial") Long id, @QueryParam("fields") String fields) {
		FilialDTO filialDTO = facade.obter(id, fields);
		return filialDTO;
    }
	
	@GET
    @Produces("application/json")
	public ResultadoPaginadoDTO<FilialDTO> listar(@QueryParam("currentpage") int currentPage,
	        @QueryParam("pagesize") int pageSize,
	        @QueryParam("nome") String nome, @QueryParam("ativo") Boolean ativo,	        
	        @QueryParam("fields") String fields) {

        FilialFiltroDTO filtro = new FilialFiltroDTO();
        
        filtro.setNome(nome);

        // Paginação
        if (pageSize != 0) {
            filtro.getPagina().setPageSize(pageSize);
        }
        if (currentPage != 0) {
            filtro.getPagina().setCurrentPage(currentPage);
        }

        return facade.listar(filtro, fields);
    }
	
	@POST
    @Produces("application/json")
    @Consumes("application/json")
    public Response inserir(FilialDTO filialDTO, @Context UriInfo uriInfo) {
        ResponseDTO response = facade.persistir(filialDTO);        
        URI location = uriInfo.getRequestUriBuilder().path(String.valueOf(response.getId())).build();
        return Response.created(location).entity(response).build();
    }

    @DELETE
    @Produces("application/json")    
    public Response remover(@QueryParam("ids") List<Long> ids) {
        ResponseDTO response = facade.remover(ids.toArray(new Long[ids.size()]));
        return Response.ok(response).build();
    }
    
    @DELETE
    @Path("{codFilial}")
    @Produces("application/json")    
    public Response remover(@PathParam("codFilial") Long id) {
    	List<Long> ids = new ArrayList<Long>();
    	ids.add(id);
        
        return remover(ids);
    }
    
    @PUT
    @Path("{codFilial}")
    @Consumes("application/json")
    @Produces("application/json")    
    public Response alterar(@PathParam("codFilial") Long id, FilialDTO filialDTO) {
    	filialDTO.setCodFilial(Integer.valueOf(id.intValue()));
        ResponseDTO response = facade.persistir(filialDTO);
        return Response.ok(response).build();
    }
    
    @POST
	@Path("/foto")
	@Consumes("multipart/form-data")
	public Response uploadFile(MultipartFormDataInput input, 
			@QueryParam("nomeArquivo") String nomeArquivo, 
			@QueryParam("legenda") String legenda) {

		Map<String, List<InputPart>> uploadForm = input.getFormDataMap();
		List<InputPart> inputParts = uploadForm.get("uploadedFile");

		FotoDTO fotoDTO = null;
		
		for (InputPart inputPart : inputParts) {

		 try {

			MultivaluedMap<String, String> header = inputPart.getHeaders();
			//fileName = getFileName(header);

			//convert the uploaded file to inputstream
			InputStream inputStream = inputPart.getBody(InputStream.class,null);

			byte [] bytes = IOUtils.toByteArray(inputStream);

			//constructs upload file path
			String pathNomeArquivo = "/tmp/" + nomeArquivo;

			writeFile(bytes,pathNomeArquivo);
			
			fotoDTO = new FotoDTO();
			fotoDTO.setLegenda(legenda);
			fotoDTO.setPath(pathNomeArquivo);

			fotoFacade.inserir(fotoDTO);

		  } catch (IOException e) {
			e.printStackTrace();
		  }

		}

		return Response.ok(fotoDTO).build();

	}
    
    /**
	 * header sample
	 * {
	 * 	Content-Type=[image/png],
	 * 	Content-Disposition=[form-data; name="file"; filename="filename.extension"]
	 * }
	 **/
	//get uploaded filename, is there a easy way in RESTEasy?
	private String getFileName(MultivaluedMap<String, String> header) {

		String[] contentDisposition = header.getFirst("Content-Disposition").split(";");

		for (String filename : contentDisposition) {
			if ((filename.trim().startsWith("filename"))) {

				String[] name = filename.split("=");

				String finalFileName = name[1].trim().replaceAll("\"", "");
				return finalFileName;
			}
		}
		return "unknown";
	}

	//save to somewhere
	private void writeFile(byte[] content, String filename) throws IOException {

		File file = new File(filename);

		if (!file.exists()) {
			file.createNewFile();
		}

		FileOutputStream fop = new FileOutputStream(file);

		fop.write(content);
		fop.flush();
		fop.close();

	}
	
}