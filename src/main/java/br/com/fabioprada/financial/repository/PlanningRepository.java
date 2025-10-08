package br.com.fabioprada.financial.repository;

import br.com.fabioprada.financial.model.Planning;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlanningRepository extends JpaRepository<Planning, Long> {}