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
public class Planning {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int month;
    private int year;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private BigDecimal estimatedAmount;

    public String getYearMonth() {
        return String.format("%d-%02d", year, month);
    }

    public BigDecimal getPlannedValue() {
        return estimatedAmount;
    }
}