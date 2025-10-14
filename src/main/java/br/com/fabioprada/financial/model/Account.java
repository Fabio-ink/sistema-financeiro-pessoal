package br.com.fabioprada.financial.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import org.hibernate.annotations.Formula;

@Entity
@Table(name = "contas")
@Data
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal initialBalance;

    @Formula("initial_balance + " +
             "(SELECT COALESCE(SUM(t.amount), 0) FROM transacoes t WHERE t.conta_entrada_id = id) - " +
             "(SELECT COALESCE(SUM(t.amount), 0) FROM transacoes t WHERE t.conta_saida_id = id)")
    private BigDecimal currentBalance;
}