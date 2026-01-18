package br.com.fabioprada.financial.dto;

import br.com.fabioprada.financial.model.MonthlyPlanning;
import br.com.fabioprada.financial.model.Transaction;
import lombok.Data;
import java.util.List;

@Data
public class ImportDataDTO {
    private List<Transaction> transactions;
    private List<MonthlyPlanning> monthlyPlannings;
}
