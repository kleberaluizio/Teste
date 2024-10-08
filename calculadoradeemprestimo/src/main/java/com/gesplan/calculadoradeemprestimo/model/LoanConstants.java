package com.gesplan.calculadoradeemprestimo.model;

import com.gesplan.calculadoradeemprestimo.model.dto.LoanInfoDTO;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class LoanConstants
{
	public final static int BASE_DAYS = 360;
	private final int TOTAL_INSTALLMENTS;
	private final double INTEREST_RATE;
	private final double AMORTIZATION_VALUE;

	public LoanConstants(LoanInfoDTO loanInfo)
	{
		this.TOTAL_INSTALLMENTS = getInstallmentsNumber(loanInfo);
		this.INTEREST_RATE = loanInfo.getInterestRate()/100;
		this.AMORTIZATION_VALUE = loanInfo.getLoanAmount()/TOTAL_INSTALLMENTS;
	}

	public int getTotalInstallments()
	{
		return TOTAL_INSTALLMENTS;
	}

	public double getInterestRate()
	{
		return INTEREST_RATE;
	}

	public double getAmortizationValue()
	{
		return AMORTIZATION_VALUE;
	}

	private int getInstallmentsNumber(LoanInfoDTO dto)
	{
		int installments = (int) ChronoUnit.MONTHS.between(dto.getFirstPaymentDate(), dto.getFinalDate()) + 2;

		return isPaymentDateAndFinalDateEqualDayOfMonth(dto) ? installments - 1 : installments;
	}

	private boolean isPaymentDateAndFinalDateEqualDayOfMonth(LoanInfoDTO dto)
	{
		return dto.getFirstPaymentDate().getDayOfMonth() == dto.getFinalDate().getDayOfMonth();
	}
}
