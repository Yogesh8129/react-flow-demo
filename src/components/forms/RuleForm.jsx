import FormField from "../ui/FormField";
import FormSelect from "../ui/FormSelect";

const comparatorOptions = [
  { value: ">", label: "> (greater than)" },
  { value: "<", label: "< (less than)" },
  { value: ">=", label: ">= (greater or equal)" },
  { value: "<=", label: "<= (less or equal)" },
  { value: "==", label: "== (equals)" },
];

const aggregationOptions = [
  { value: "avg", label: "Average" },
  { value: "min", label: "Minimum" },
  { value: "max", label: "Maximum" },
  { value: "sum", label: "Sum" },
  { value: "last", label: "Last Value" },
];

const repeatPolicyOptions = [
  { value: "rate_limit", label: "Rate Limit" },
  { value: "once", label: "Once Only" },
  { value: "always", label: "Always" },
];

export default function RuleForm({ formik }) {
  const { values, errors, touched, handleChange, handleBlur } = formik;

  return (
    <div className="space-y-4">
      {/* Parameter */}
      <FormField
        label="Parameter"
        name="parameter"
        error={touched.parameter && errors.parameter}
      >
        <input
          id="parameter"
          name="parameter"
          type="text"
          value={values.parameter}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g., temperature, pressure, humidity"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </FormField>

      {/* Comparator and Threshold */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Comparator"
          name="comparator"
          error={touched.comparator && errors.comparator}
        >
          <FormSelect
            name="comparator"
            value={values.comparator}
            onChange={handleChange}
            options={comparatorOptions}
            placeholder=""
          />
        </FormField>

        <FormField
          label="Threshold"
          name="threshold"
          error={touched.threshold && errors.threshold}
        >
          <input
            id="threshold"
            name="threshold"
            type="number"
            value={values.threshold}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </FormField>
      </div>

      {/* Duration and Aggregation */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Duration (seconds)"
          name="duration_seconds"
          error={touched.duration_seconds && errors.duration_seconds}
        >
          <input
            id="duration_seconds"
            name="duration_seconds"
            type="number"
            min="0"
            value={values.duration_seconds}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </FormField>

        <FormField
          label="Aggregation"
          name="aggregation"
          error={touched.aggregation && errors.aggregation}
        >
          <FormSelect
            name="aggregation"
            value={values.aggregation}
            onChange={handleChange}
            options={aggregationOptions}
            placeholder=""
          />
        </FormField>
      </div>

      {/* Repeat Policy */}
      <div className="border-t pt-4 mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Repeat Policy</h4>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Type"
            name="repeat_policy.type"
            error={touched["repeat_policy.type"] && errors["repeat_policy.type"]}
          >
            <FormSelect
              name="repeat_policy.type"
              value={values.repeat_policy?.type || "rate_limit"}
              onChange={(e) =>
                formik.setFieldValue("repeat_policy.type", e.target.value)
              }
              options={repeatPolicyOptions}
              placeholder=""
            />
          </FormField>

          {values.repeat_policy?.type === "rate_limit" && (
            <FormField
              label="Interval (seconds)"
              name="repeat_policy.interval_seconds"
              error={
                touched["repeat_policy.interval_seconds"] &&
                errors["repeat_policy.interval_seconds"]
              }
            >
              <input
                id="repeat_policy.interval_seconds"
                name="repeat_policy.interval_seconds"
                type="number"
                min="0"
                value={values.repeat_policy?.interval_seconds || 300}
                onChange={(e) =>
                  formik.setFieldValue(
                    "repeat_policy.interval_seconds",
                    Number(e.target.value)
                  )
                }
                onBlur={handleBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </FormField>
          )}
        </div>
      </div>
    </div>
  );
}
