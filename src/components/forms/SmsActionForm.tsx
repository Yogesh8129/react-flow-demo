import type { FormikProps } from 'formik';
import FormField from '../ui/FormField';
import TagInput from '../ui/TagInput';
import type { SmsActionNodeData } from '@/types';

/** Simple phone validation (at least 10 digits) */
const validatePhone = (phone: string): string | null => {
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length < 10) {
    return 'Phone number must have at least 10 digits';
  }
  return null;
};

interface SmsActionFormProps {
  formik: FormikProps<SmsActionNodeData>;
}

export default function SmsActionForm({ formik }: SmsActionFormProps) {
  const { values, errors, touched } = formik;

  return (
    <div className="space-y-4">
      <FormField
        label="Recipients"
        name="recipients"
        error={touched.recipients ? (errors.recipients as string) : undefined}
      >
        <TagInput
          value={values.recipients || []}
          onChange={(recipients) => formik.setFieldValue('recipients', recipients)}
          placeholder="Enter phone numbers (e.g., +919876543210)"
          validate={validatePhone}
        />
      </FormField>

      <p className="text-xs text-gray-500">
        Add phone numbers that will receive SMS alerts when this workflow triggers.
      </p>
    </div>
  );
}
