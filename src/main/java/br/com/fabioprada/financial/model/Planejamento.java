package br.com.fabioprada.financial.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
//import java.time.YearMonth;

@Entity
@Table(name = "planejamentos")
@Data
public class Planejamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Armazenaremos como String "YYYY-MM" para simplicidade
    @Column(nullable = false)
    private String yearMonth;

    @Column(nullable = false)
    private BigDecimal plannedValue;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false) // Relacionamento
    private Category category;
}