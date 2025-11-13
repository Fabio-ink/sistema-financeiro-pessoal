package br.com.fabioprada.financial.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import org.hibernate.annotations.Formula;

@Entity
@Table(name = "contas")
@Getter
@Setter
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @PrePersist
    public void prePersist() {
        if (this.currentBalance == null) {
            this.currentBalance = this.initialBalance;
        }
    }
}