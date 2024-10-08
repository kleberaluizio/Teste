import React from 'react'
import styled from 'styled-components';
import { toast, Toaster} from 'react-hot-toast';
import { NumericFormat } from 'react-number-format';
import { useForm } from 'react-hook-form';
import { LoanService } from '../../services/loanService';
import { LoanRequest } from '../../types/loanRequest';
import { LoanScheduleEntry } from '../../types/LoanScheduleEntry';
import { useFinancialSummary } from '../../context/FinancialSummaryContext';

const loanService = new LoanService();

let shouldNotProceedSubmit: Boolean = false;
let hasError: Boolean = false;


const LoanInputInfo: React.FC = () => {
  const { setSummary } = useFinancialSummary();
  const { register, handleSubmit, setValue, getValues,formState: { errors } } = useForm<LoanRequest>();

  
  const validateFields = (data: LoanRequest) => {
    const requiredFields = ['initialDate', 'finalDate', 'firstPaymentDate', 'loanAmount', 'interestRate'];
    hasError = false;

    requiredFields.forEach(field => {
      if (!data[field]) {
        hasError = true;
      }
    });

    if (hasError) {
      triggerToast('Todos os campos são obrigatórios!');
    }

    if (new Date(data.finalDate) <= new Date(data.initialDate)) {
      triggerToast('Data final deve ser após a data inicial');
    }

    if (new Date(data.initialDate) >= new Date(data.firstPaymentDate) || new Date(data.finalDate) <= new Date(data.firstPaymentDate)) {
      triggerToast('Primeiro pagamento deve ser após a data inicial e antes da data final');
    }
   
    if (!hasError) {
      shouldNotProceedSubmit = false;
    }
  };

  const triggerToast = (message) =>{
    toast.error(message);
    hasError = true;
    shouldNotProceedSubmit = true;
  }

  const onSubmit = async (data: LoanRequest) => {
    try {
      validateFields(data);
      
      if (shouldNotProceedSubmit) {
        setSummary([])
        return;
      }
      const result: LoanScheduleEntry[] = await loanService.getFinancialSummary(data);
      setSummary(result);
    } catch (error) {
      toast.error('Ops! Operação indisponível temporariamente.');
    }
  };

  return (
    <LoanForm onSubmit={handleSubmit(onSubmit)} className="row">
      <div className="form-group col-xl-2 col-6 px-3">
        <label htmlFor="initialDate">Data Inicial</label>
        <input type="date" className='form-control' id="initialDate" {...register('initialDate')} />
      </div>
      <div className="form-group col-xl-2 col-6 px-3">
        <label htmlFor="finalDate">Data Final</label>
        <input type="date" className="form-control" id="finalDate" {...register('finalDate')} />
      </div>
      <div className="form-group col-xl-2 col-6 px-3">
        <label htmlFor="firstPaymentDate">Primeiro Pagamento</label>
        <input type="date" className="form-control" id="firstPaymentDate" {...register('firstPaymentDate')}/>
      </div>
      <div className="form-group col-xl-2 col-6 px-3">
        <label htmlFor="loanAmount">Valor do Empréstimo</label>
        <NumericFormat
          className="form-control"
          id="loanAmount"
          prefix="R$ "
          decimalScale={2}
          fixedDecimalScale={true}
          placeholder="Digite um valor"
          thousandSeparator="."
          decimalSeparator={','}
          allowNegative={false}
          value={getValues('loanAmount')}
          onValueChange={(values) => setValue('loanAmount', values.value ? parseFloat(values.value) : 0)}
        />
      </div>
      <div className="form-group col-xl-2 col-6 px-3">
        <label htmlFor="interestRate">Taxa de Juros</label>
        <NumericFormat
          className="form-control"
          id="interestRate"
          thousandSeparator={false}
          suffix=" %"
          decimalScale={1}
          fixedDecimalScale={true}
          placeholder="Digite um valor"
          decimalSeparator={','}
          allowNegative={false}
          value={getValues('interestRate')}
          onValueChange={(values) => setValue('interestRate', values.value ? parseFloat(values.value) : 0)}
        />
      </div>
      <div className="col-xl-2 col-6 px-3 button-container">
        <button type="submit" className="btn btn-primary col-12">Calcular</button>
      </div>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000, 
          style: {
            color: 'black',
            margin:'0 45px 0 0',
            border: '2px solid black',
          },
        }} />
    </LoanForm>
    
  )
}

const LoanForm = styled.form`
  display: flex;
  flex-direction: row;
  margin: 0 30px 30px 30px;
`;

export default LoanInputInfo