FROM public.ecr.aws/lambda/python:3.13

# Install dependencies
COPY requirements.txt ${LAMBDA_TASK_ROOT}/
RUN pip install -r ${LAMBDA_TASK_ROOT}/requirements.txt --no-cache-dir

# Copy application code and model
COPY app.py ${LAMBDA_TASK_ROOT}/
COPY api/ ${LAMBDA_TASK_ROOT}/api/
COPY service/ ${LAMBDA_TASK_ROOT}/service/
COPY model/ ${LAMBDA_TASK_ROOT}/model/

# Set AWS Lambda handler
CMD [ "app.handler" ]
