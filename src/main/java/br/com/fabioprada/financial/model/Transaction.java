package br.com.fabioprada.financial.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "transacoes")
@Data
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private BigDecimal valor;

    @Column(nullable = false)
    private LocalDate dataCriacao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType transactionType;

    @ManyToOne
    @JoinColumn(name = "categoria_id") // Relacionamento
    private Category category;

    @ManyToOne
    @JoinColumn(name = "conta_saida_id") // Relacionamento
    private Account outAccount;

    @ManyToOne
    @JoinColumn(name = "conta_entrada_id") // Relacionamento
    private Account inAccount;
}