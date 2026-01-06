import { useFormik, type FormikProps } from 'formik';
import type { ZodSchema } from 'zod';
import Modal from '../ui/Modal';
import { nodeSchemas } from '@/schemas/nodeSchemas';
import { NODE_CONFIG } from '@/constants/nodeConfig';
import DeviceSelectorForm from './DeviceSelectorForm';
import RuleForm from './RuleForm';
import EmailActionForm from './EmailActionForm';
import SmsActionForm from './SmsActionForm';
import type { NodeType, WorkflowNodeData } from '@/types';

/** Convert Zod errors to Formik error format */
function createValidator<T>(schema: ZodSchema<T>) {
  return (values: T): Record<string, string> => {
    const result = schema.safeParse(values);
    if (result.success) return {};

    const errors: Record<string, string> = {};
    result.error.errors.forEach((err) => {
      // Handle nested paths like "repeat_policy.type"
      const path = err.path.join('.');
      errors[path] = err.message;
    });
    return errors;
  };
}

/** Map node types to form components */
const formComponents: Record<
  NodeType,
  React.ComponentType<{ formik: FormikProps<WorkflowNodeData> }>
> = {
  deviceSelector: DeviceSelectorForm as React.ComponentType<{
    formik: FormikProps<WorkflowNodeData>;
  }>,
  rule: RuleForm as React.ComponentType<{
    formik: FormikProps<WorkflowNodeData>;
  }>,
  emailAction: EmailActionForm as React.ComponentType<{
    formik: FormikProps<WorkflowNodeData>;
  }>,
  smsAction: SmsActionForm as React.ComponentType<{
    formik: FormikProps<WorkflowNodeData>;
  }>,
};

interface NodeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeType: NodeType;
  initialValues: WorkflowNodeData;
  onSubmit: (values: WorkflowNodeData) => void;
}

export default function NodeFormModal({
  isOpen,
  onClose,
  nodeType,
  initialValues,
  onSubmit,
}: NodeFormModalProps) {
  const schema = nodeSchemas[nodeType];
  const config = NODE_CONFIG[nodeType];
  const FormComponent = formComponents[nodeType];

  const formik = useFormik({
    initialValues,
    validate: schema ? createValidator(schema) : undefined,
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit(values);
      onClose();
    },
  });

  if (!FormComponent || !config) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Configure ${config.label}`}>
      <form onSubmit={formik.handleSubmit}>
        <FormComponent formik={formik} />

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm text-white bg-emerald-500 hover:bg-emerald-600 rounded-md"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}
