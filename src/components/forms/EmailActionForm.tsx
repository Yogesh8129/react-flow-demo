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
          placeholder="Enter email addresses"
          validate={validateEmail}
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
          placeholder="e.g., tmpl_overheat"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </FormField>
    </div>
  );
}
