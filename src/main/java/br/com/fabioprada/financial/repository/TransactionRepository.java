package br.com.fabioprada.financial.repository;

import br.com.fabioprada.financial.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("SELECT t FROM Transaction t WHERE YEAR(t.creationDate) = :year AND MONTH(t.creationDate) = :month")
    List<Transaction> findByYearAndMonth(@Param("year") int year, @Param("month") int month);

}