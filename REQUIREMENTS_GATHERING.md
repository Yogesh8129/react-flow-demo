# Workflow Engine Requirements Gathering

**Status:** In Progress
**Date Started:** 2026-01-05
**Branch:** claude/workflow-engine-planning-ksRvG (based on prototype/node-based-on-cards)

---

## Purpose
This document captures critical information needed to complete the device-parameter limit alert workflow engine. All questions must be answered before moving to implementation planning.

---

## Critical Questions

### 1. Backend API Integration

**Status:** ⏳ Awaiting Answer

**Questions:**
- Do you have an existing backend API for this project? (Yes/No)
- If YES:
  - What is the base URL?
  - Do you have API documentation? (Swagger/OpenAPI link or file)
  - What authentication mechanism is used? (JWT, API Key, Session, None)
  - Can you share the API endpoints that exist?
- If NO:
  - Are you building the backend yourself?
  - Is someone else building it?
  - Do you need API contract design help?

**Your Answer:**
```
[Your answer here]
```

**Confidence Score:** __%

---

### 2. Device Data Source

**Status:** ⏳ Awaiting Answer

**Questions:**
- Where does device telemetry data come from?
  - [ ] IoT Platform (which one?)
  - [ ] REST API
  - [ ] MQTT Broker
  - [ ] Database directly
  - [ ] Other: ___________
- Can you provide an example JSON of a device object?
- Can you provide an example JSON of a telemetry data point?
- How frequently does telemetry data update? (real-time, every second, minute, etc.)
- How do device "tags" work? (e.g., `line:A`, `zone:heating`)
  - Are tags predefined?
  - Can users create new tags?
  - Where are tags stored?

**Your Answer:**
```
[Your answer here]
```

**Example Device JSON:**
```json
[Paste example here]
```

**Example Telemetry JSON:**
```json
[Paste example here]
```

**Confidence Score:** __%

---

### 3. Workflow Execution Architecture

**Status:** ⏳ Awaiting Answer

**Questions:**
- Who/what executes workflows in production?
  - [ ] Backend service (runs 24/7, monitors devices continuously)
  - [ ] Frontend (only when user has browser open)
  - [ ] Separate microservice
  - [ ] Cloud function / serverless
  - [ ] Not decided yet
- When a workflow is "enabled", what happens?
  - Does it start monitoring immediately?
  - Does backend poll devices?
  - Does backend subscribe to real-time streams?
- How are workflow executions logged?
  - Is there an execution history API?
  - Where are logs stored?
- Can workflows be manually triggered for testing?

**Your Answer:**
```
[Your answer here]
```

**Confidence Score:** __%

---

### 4. Email/SMS Templates

**Status:** ⏳ Awaiting Answer

**Questions:**
- Where are email/SMS templates managed?
  - [ ] Backend/Server-side (users select from predefined templates)
  - [ ] Frontend (users can create/edit templates in UI)
  - [ ] External service (e.g., SendGrid templates, Twilio messaging service)
  - [ ] Not decided yet
- What information is available in templates?
  - Device name?
  - Parameter name?
  - Current value?
  - Threshold value?
  - Timestamp?
- Can users customize message content, or only select template IDs?
- What email/SMS service is used?
  - [ ] SendGrid
  - [ ] AWS SES
  - [ ] Twilio
  - [ ] Custom SMTP server
  - [ ] Other: ___________
  - [ ] Not decided yet

**Your Answer:**
```
[Your answer here]
```

**Confidence Score:** __%

---

### 5. Project Scope & Goals

**Status:** ⏳ Awaiting Answer

**Questions:**
- What specific help do you need from me? (Check all that apply)
  - [ ] Connect frontend to existing backend API
  - [ ] Design missing API contracts (if backend doesn't exist)
  - [ ] Build missing UI features (specify which)
  - [ ] Add real-time monitoring/updates
  - [ ] Improve data validation
  - [ ] Add user authentication/authorization UI
  - [ ] Performance optimization
  - [ ] Testing strategy (unit/integration/e2e)
  - [ ] Deployment setup
  - [ ] Other: ___________

- What is your timeline/deadline?
  - [ ] No deadline (learning project)
  - [ ] Specific date: ___________
  - [ ] ASAP / Urgent
  - [ ] Flexible

- What is your React/JavaScript experience level?
  - [ ] Beginner (< 6 months)
  - [ ] Intermediate (6 months - 2 years)
  - [ ] Advanced (2+ years)

- Are you working solo or with a team?
  - [ ] Solo
  - [ ] Team (how many people? ___)

**Your Answer:**
```
[Your answer here]
```

**Confidence Score:** __%

---

## Additional Information

If there's anything else you think is important for me to know about this project, add it here:

```
[Additional context]
```

---

## Next Steps (After All Questions Answered)

Once all questions above are answered with confidence scores, we will:
1. Review and clarify any unclear answers
2. Identify gaps in existing implementation
3. Create a detailed, phased implementation plan
4. Define specific tasks with acceptance criteria
5. Establish development workflow and best practices

**DO NOT PROCEED TO PLANNING UNTIL ALL QUESTIONS HAVE ANSWERS**
