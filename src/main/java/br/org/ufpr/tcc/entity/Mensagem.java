package br.org.ufpr.tcc.entity;

public class Mensagem {

	public static final int INFO = 1;  
	public static final int AVISO = 2;
	public static final int ERRO = 3;
	
	private int severidade;
	
	private String texto;

	public int getSeveridade() {
		return severidade;
	}

	public void setSeveridade(int severidade) {
		this.severidade = severidade;
	}
	
}
