package br.com.fabioprada.financial.repository;

import br.com.fabioprada.financial.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {}