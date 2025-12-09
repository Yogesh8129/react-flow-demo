import FormField from "../ui/FormField";
import TagInput from "../ui/TagInput";

export default function DeviceSelectorForm({ formik }) {
  return (
    <div>
      <FormField
        label="Device Tags"
        name="tags"
        error={formik.touched.tags && formik.errors.tags}
      >
        <TagInput
          value={formik.values.tags || []}
          onChange={(tags) => formik.setFieldValue("tags", tags)}
          placeholder="e.g., line:A, zone:heating"
        />
      </FormField>
      <p className="text-xs text-gray-500 -mt-2">
        Add tags to select devices. Press Enter after each tag.
      </p>
    </div>
  );
}
