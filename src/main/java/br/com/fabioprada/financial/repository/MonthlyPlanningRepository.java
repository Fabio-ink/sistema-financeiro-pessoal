package br.com.fabioprada.financial.repository;

import br.com.fabioprada.financial.model.MonthlyPlanning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MonthlyPlanningRepository extends JpaRepository<MonthlyPlanning, Long> {
    @Query("SELECT mp FROM MonthlyPlanning mp WHERE mp.year = :year AND mp.month = :month")
    List<MonthlyPlanning> findByYearAndMonth(@Param("year") int year, @Param("month") int month);
}