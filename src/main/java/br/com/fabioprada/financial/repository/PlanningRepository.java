package br.com.fabioprada.financial.repository;

import br.com.fabioprada.financial.model.Planning;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanningRepository extends JpaRepository<Planning, Long> {
    List<Planning> findByYearAndMonth(int year, int month);
}