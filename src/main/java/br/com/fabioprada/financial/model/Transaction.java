package br.com.fabioprada.financial.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.springframework.web.bind.annotation.CrossOrigin;

@Entity
@Table(name = "transacoes")
@CrossOrigin(origins = "http://localhost:5173") // Permite acesso do nosso frontend
@Data
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal amount; // Alterado de 'value' para 'amount'

    @Column(nullable = false)
    private LocalDate creationDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType transactionType;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "conta_saida_id")
    private Account outAccount;

    @ManyToOne
    @JoinColumn(name = "conta_entrada_id")
    private Account inAccount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "installment_number")
    private Integer installmentNumber;

    @Column(name = "total_installments")
    private Integer totalInstallments;
}