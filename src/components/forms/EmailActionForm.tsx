import type { FormikProps } from 'formik';
import FormField from '../ui/FormField';
import TagInput from '../ui/TagInput';
import type { EmailActionNodeData } from '@/types';

/** Simple email validation */
const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }
  return null;
};

interface EmailActionFormProps {
  formik: FormikProps<EmailActionNodeData>;
}

export default function EmailActionForm({ formik }: EmailActionFormProps) {
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
          placeholder="Enter email addresses"
          validate={validateEmail}
        />
      </FormField>

      <p className="text-xs text-gray-500">
        Add email addresses that will receive alerts when this workflow triggers.
      </p>
    </div>
  );
}
