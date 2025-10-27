package br.com.fabioprada.financial.dto;

import java.math.BigDecimal;

public class MonthSummaryDTO {

    private String title;
    private BigDecimal totalSpent;
    private BigDecimal totalIncome;
    private BigDecimal plannedBudget;

    public MonthSummaryDTO(String title, BigDecimal totalSpent, BigDecimal totalIncome, BigDecimal plannedBudget) {
        this.title = title;
        this.totalSpent = totalSpent;
        this.totalIncome = totalIncome;
        this.plannedBudget = plannedBudget;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public BigDecimal getTotalSpent() {
        return totalSpent;
    }

    public void setTotalSpent(BigDecimal totalSpent) {
        this.totalSpent = totalSpent;
    }

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public BigDecimal getPlannedBudget() {
        return plannedBudget;
    }

    public void setPlannedBudget(BigDecimal plannedBudget) {
        this.plannedBudget = plannedBudget;
    }
}
