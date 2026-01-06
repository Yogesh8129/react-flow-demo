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
  const { values, errors, touched, handleChange, handleBlur } = formik;

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

      <FormField
        label="Template ID"
        name="template_id"
        error={touched.template_id ? errors.template_id : undefined}
      >
        <input
          id="template_id"
          name="template_id"
          type="text"
          value={values.template_id}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g., tmpl_overheat_sms"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </FormField>
    </div>
  );
}
