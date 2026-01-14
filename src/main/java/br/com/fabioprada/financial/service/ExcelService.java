package br.com.fabioprada.financial.service;

import br.com.fabioprada.financial.model.Account;
import br.com.fabioprada.financial.model.Category;
import br.com.fabioprada.financial.model.Transaction;
import br.com.fabioprada.financial.model.TransactionType;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
public class ExcelService {

    public static String TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    static String[] HEADERS = { "Nome", "Data", "Valor", "Tipo", "Categoria", "Conta Saída", "Conta Entrada" };
    static String SHEET = "Transações";

    public ByteArrayInputStream transactionsToExcel(List<Transaction> transactions) {

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet(SHEET);

            // Header
            Row headerRow = sheet.createRow(0);
            for (int col = 0; col < HEADERS.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(HEADERS[col]);
            }

            int rowIdx = 1;
            for (Transaction transaction : transactions) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(transaction.getName());
                row.createCell(1).setCellValue(transaction.getCreationDate().toString());
                row.createCell(2).setCellValue(transaction.getAmount().doubleValue());
                row.createCell(3).setCellValue(transaction.getTransactionType().name());

                if (transaction.getCategory() != null) {
                    row.createCell(4).setCellValue(transaction.getCategory().getName());
                }

                if (transaction.getOutAccount() != null) {
                    row.createCell(5).setCellValue(transaction.getOutAccount().getName());
                }

                if (transaction.getInAccount() != null) {
                    row.createCell(6).setCellValue(transaction.getInAccount().getName());
                }
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("fail to import data to Excel file: " + e.getMessage());
        }
    }

    public List<Transaction> excelToTransactions(InputStream is) {
        try {
            Workbook workbook = new XSSFWorkbook(is);
            Sheet sheet = workbook.getSheet(SHEET);
            // If sheet is null, maybe get the first sheet
            if (sheet == null) {
                sheet = workbook.getSheetAt(0);
            }

            Iterator<Row> rows = sheet.iterator();

            List<Transaction> transactions = new ArrayList<>();

            int rowNumber = 0;
            while (rows.hasNext()) {
                Row currentRow = rows.next();

                // Skip header
                if (rowNumber == 0) {
                    rowNumber++;
                    continue;
                }

                Transaction transaction = new Transaction();

                // Name (Column 0)
                Cell nameCell = currentRow.getCell(0);
                if (nameCell != null)
                    transaction.setName(getCellValueAsString(nameCell));

                // Date (Column 1)
                Cell dateCell = currentRow.getCell(1);
                if (dateCell != null) {
                    String dateStr = getCellValueAsString(dateCell);
                    // Handle different formats if necessary, for now assume ISO or common format
                    // Parsing simple yyyy-MM-dd
                    try {
                        transaction.setCreationDate(LocalDate.parse(dateStr));
                    } catch (Exception e) {
                        // Fallback or attempt other formats? Assume standard ISO for now
                        // Usually POI can return date if cell type is NUMERIC and formatted as date
                        if (dateCell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(dateCell)) {
                            transaction.setCreationDate(dateCell.getLocalDateTimeCellValue().toLocalDate());
                        } else {
                            // Try parsing standard formats
                            // Since we export as .toString() (yyyy-MM-dd), we expect that
                            transaction.setCreationDate(LocalDate.parse(dateStr));
                        }
                    }
                }

                // Amount (Column 2)
                Cell amountCell = currentRow.getCell(2);
                if (amountCell != null) {
                    if (amountCell.getCellType() == CellType.NUMERIC) {
                        transaction.setAmount(BigDecimal.valueOf(amountCell.getNumericCellValue()));
                    } else {
                        transaction.setAmount(new BigDecimal(getCellValueAsString(amountCell)));
                    }
                }

                // Type (Column 3)
                Cell typeCell = currentRow.getCell(3);
                if (typeCell != null) {
                    String typeStr = getCellValueAsString(typeCell);
                    transaction.setTransactionType(TransactionType.valueOf(typeStr));
                }

                // Category (Column 4)
                Cell categoryCell = currentRow.getCell(4);
                if (categoryCell != null) {
                    String categoryName = getCellValueAsString(categoryCell);
                    if (!categoryName.isEmpty()) {
                        Category category = new Category();
                        category.setName(categoryName);
                        transaction.setCategory(category);
                    }
                }

                // Out Account (Column 5)
                Cell outAccountCell = currentRow.getCell(5);
                if (outAccountCell != null) {
                    String outAccountName = getCellValueAsString(outAccountCell);
                    if (!outAccountName.isEmpty()) {
                        Account outAccount = new Account();
                        outAccount.setName(outAccountName);
                        transaction.setOutAccount(outAccount);
                    }
                }

                // In Account (Column 6)
                Cell inAccountCell = currentRow.getCell(6);
                if (inAccountCell != null) {
                    String inAccountName = getCellValueAsString(inAccountCell);
                    if (!inAccountName.isEmpty()) {
                        Account inAccount = new Account();
                        inAccount.setName(inAccountName);
                        transaction.setInAccount(inAccount);
                    }
                }

                transactions.add(transaction);
            }

            workbook.close();

            return transactions;
        } catch (IOException e) {
            throw new RuntimeException("fail to parse Excel file: " + e.getMessage());
        }
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null)
            return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf(cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return "";
        }
    }
}
