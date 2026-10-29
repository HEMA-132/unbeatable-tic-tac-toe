# End-to-End CI/CD Case Study: Unbeatable Tic-Tac-Toe

## Scope and preservation rule

This case study deploys the existing application in `tic-tac-toe-app/`. Do not edit the game's UI, gameplay, AI, styling, or existing tests as part of DevOps work. The build pipeline uses the existing npm scripts and lockfile.

## Architecture

Git/GitHub → Jenkins → Maven-orchestrated npm tests/build → Docker image (Nginx) → Kubernetes Deployment and Service.

Maven is used as a build orchestrator because the course requires Maven. Vite and TypeScript remain the actual frontend build tools; the application is not rewritten in Java.

## Requirements

- Git and access to this repository
- JDK and Maven
- Docker Engine
- Jenkins agent with Git, Java, Maven and Docker CLI/daemon access
- Kubernetes cluster and kubectl for the optional deployment stage

## Local verification

From the repository root:

```bash
mvn -B clean verify
docker build -t unbeatable-tic-tac-toe:latest .
docker run --rm -p 8080:80 unbeatable-tic-tac-toe:latest
```

Open http://localhost:8080 to verify the existing game.

## Kubernetes deployment

The image must be available to every Kubernetes node that can run the Pods. For a local Docker Desktop Kubernetes cluster, build the image using the Docker daemon used by that cluster. For Minikube, load it with `minikube image load unbeatable-tic-tac-toe:latest` after building.

```bash
kubectl apply -f k8s/
kubectl rollout status deployment/unbeatable-tic-tac-toe
kubectl get deployments,pods,services
```

Open http://localhost:30080 when using a local cluster that exposes NodePort on localhost. Otherwise use the cluster's node address and port 30080.

Scale and inspect:

```bash
kubectl scale deployment/unbeatable-tic-tac-toe --replicas=3
kubectl get pods -l app=unbeatable-tic-tac-toe
kubectl logs deployment/unbeatable-tic-tac-toe
kubectl describe deployment unbeatable-tic-tac-toe
```

## Jenkins setup

Create a Pipeline job configured to use this repository and the `devops-case-study` branch, with Pipeline script path `Jenkinsfile`. Ensure the agent has Maven, Docker access and kubectl if Kubernetes deployment is enabled. Run once with `DEPLOY_TO_K8S=false`; enable deployment only after the image is available to the cluster and the agent has the right cluster credentials.

The Kubernetes stage is intentionally opt-in. A Docker image built on a Jenkins agent is not automatically available to a separate remote Kubernetes cluster. For remote deployment, push the image to a registry and update the manifest to use that registry image.

## CI quality gate

The Maven workflow runs the existing `npm ci`, `npm test`, and `npm run build` commands. If tests or the production build fail, Maven fails and Jenkins will not proceed to the Docker or Kubernetes stages.

## Evidence to include in the submitted report

1. Git branch and commit history showing the DevOps configuration added separately.
2. Maven console output showing the test and build results.
3. Docker image listing and a browser screenshot of the unchanged game running from the container.
4. Jenkins stage view for a successful run and, if demonstrated, a failed test/build run.
5. Kubernetes Deployment, Pod and Service output; rollout status; scaling output.
6. Browser screenshot of the game served by Kubernetes.
7. Screenshots of the separate Freestyle, Scripted Pipeline, Java, Spring Boot and Flask exercises required by the syllabus.

Do not claim successful execution until each command has been run and the result captured.
