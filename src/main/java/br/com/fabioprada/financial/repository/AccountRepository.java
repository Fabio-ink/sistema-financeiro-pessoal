package br.com.fabioprada.financial.repository;

import br.com.fabioprada.financial.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Long> {}