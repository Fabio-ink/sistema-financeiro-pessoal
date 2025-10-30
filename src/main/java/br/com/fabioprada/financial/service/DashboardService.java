package br.com.fabioprada.financial.service;
import br.com.fabioprada.financial.dto.MonthSummaryDTO;
import br.com.fabioprada.financial.model.Planning;
import br.com.fabioprada.financial.model.Transaction;
import br.com.fabioprada.financial.model.TransactionType;
import br.com.fabioprada.financial.repository.PlanningRepository;
import br.com.fabioprada.financial.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private PlanningRepository planningRepository;

    public Map<String, MonthSummaryDTO> getMonthlySummaries() {
        LocalDate today = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(today);
        YearMonth previousMonth = currentMonth.minusMonths(1);
        YearMonth nextMonth = currentMonth.plusMonths(1);

        MonthSummaryDTO previousMonthSummary = createSummaryForMonth(previousMonth);
        MonthSummaryDTO currentMonthSummary = createSummaryForMonth(currentMonth);
        MonthSummaryDTO nextMonthSummary = createSummaryForMonth(nextMonth);

        return Map.of(
                "previous", previousMonthSummary,
                "current", currentMonthSummary,
                "next", nextMonthSummary
        );
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    private MonthSummaryDTO createSummaryForMonth(YearMonth month) {
        List<Transaction> transactions = transactionRepository.findByYearAndMonth(month.getYear(), month.getMonthValue());
        List<Planning> plannings = planningRepository.findByYearMonth(month.format(DateTimeFormatter.ofPattern("yyyy-MM")));

        BigDecimal totalIncome = transactions.stream()
                .filter(t -> t.getTransactionType() == TransactionType.ENTRADA)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalSpent = transactions.stream()
                .filter(t -> t.getTransactionType() == TransactionType.SAIDA)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal plannedBudget = plannings.stream()
                .map(Planning::getPlannedValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        String title = month.format(DateTimeFormatter.ofPattern("yyyy-MMMM"));

        return new MonthSummaryDTO(title, totalSpent, totalIncome, plannedBudget);
    }
}
