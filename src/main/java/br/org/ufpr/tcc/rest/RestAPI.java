package br.org.ufpr.tcc.rest;

import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;

@ApplicationPath("/rest-clovis")
public class RestAPI extends Application {
	private Set<Object> singletons = new HashSet<Object>();

	public RestAPI() {
		singletons.add(new ClienteREST());
	}

	@Override
	public Set<Object> getSingletons() {
		return singletons;
	}
}