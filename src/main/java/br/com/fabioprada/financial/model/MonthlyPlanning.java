package br.com.fabioprada.financial.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyPlanning {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int month;
    private int year;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private BigDecimal estimatedAmount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public String getYearMonth() {
        return "%d-%02d".formatted(year, month);
    }

    public BigDecimal getPlannedValue() {
        return estimatedAmount;
    }
}