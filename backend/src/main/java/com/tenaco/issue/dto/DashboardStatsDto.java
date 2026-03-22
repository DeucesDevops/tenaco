package com.tenaco.issue.dto;

public class DashboardStatsDto {
    private long totalProperties;
    private long totalTenants;
    private long openIssues;
    private long resolvedIssues;

    public DashboardStatsDto() {}

    public DashboardStatsDto(long totalProperties, long totalTenants, long openIssues, long resolvedIssues) {
        this.totalProperties = totalProperties;
        this.totalTenants = totalTenants;
        this.openIssues = openIssues;
        this.resolvedIssues = resolvedIssues;
    }

    public long getTotalProperties() { return totalProperties; }
    public void setTotalProperties(long totalProperties) { this.totalProperties = totalProperties; }
    public long getTotalTenants() { return totalTenants; }
    public void setTotalTenants(long totalTenants) { this.totalTenants = totalTenants; }
    public long getOpenIssues() { return openIssues; }
    public void setOpenIssues(long openIssues) { this.openIssues = openIssues; }
    public long getResolvedIssues() { return resolvedIssues; }
    public void setResolvedIssues(long resolvedIssues) { this.resolvedIssues = resolvedIssues; }
}
