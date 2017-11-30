package br.org.ufpr.tcc.util.reports;


public enum Relatorio {
    CLIENTES("ClientesPDFReport", "Relat�rio de Clientes"),
    RESERVAS("ClientesPDFReport", "Relat�rio de Reservas");
    
    private String reportTitle;

    private String jasperReportName;

    private Relatorio(String jasperReportName, String reportTitle) {
        this.jasperReportName = jasperReportName;
        this.reportTitle = reportTitle;
    }

    public String getReportTitle() {
        return reportTitle;
    }

    public String getJasperReportName() {
        return jasperReportName;
    }

}