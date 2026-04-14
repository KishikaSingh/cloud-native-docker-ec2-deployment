Cloud-Native Application Deployment using Docker on AWS EC2

This repository contains the documentation and implementation details for deploying a containerized Python application on a cloud-native environment using Docker and AWS EC2 (Ubuntu Linux). The project focuses on bridging the gap between development and production environments through containerization.

System Architecture

The architecture follows a request/response flow where a client accesses the application hosted within a Docker container on an AWS EC2 instance. Security is maintained via SSH key pairs and AWS Security Groups acting as firewalls.

Table of Contents

[Abstract](#abstract)

[Introduction](#introduction)

[Problem Statement](#problem-statement)

[Existing System](#existing-system)

[Limitations of Existing System](#limitations-of-existing-system)

[Proposed System](#proposed-system)

[Objectives](#objectives)

[Scope of Project](#scope-of-project)

[Methodology](#methodology)

[Technology Stack](#technology-stack)

[Core Concepts](#core-concepts)

[AWS EC2 Detailed Explanation](#aws-ec2-detailed-explaination)

[Docker Detailed Explanation](#docker-detailed-explaination)

[Ubuntu Linux Fundamentals](#ubuntu-linux-fundamentals)

[Implementation Plan](#implementation-plan)

[Step-by-Step Implementation](#step-by-step-implementations)

[Security and Networking](#security-and-networking)

[Testing and Validation](#testing-and-validation)

[Results and Observations](#results-and-observations)

[Benefits of the System](#benefits-of-the-system)

[Comparative Analysis](#comparative-analysis)

[Performance Analysis](#performance-analysis)

[Cost Analysis](#cost-analysis)

[Challenges Faced](#challenges-faced)

[Limitations](#limitations)

[Future Enhancements](#future-enhancements)

[Real World Applications](#real-world-applications)

[Conclusion](#conclusions)


Abstract

The primary objective of this project is to eliminate inconsistencies between development and production environments. By using Docker, the application is packaged with all its required dependencies, ensuring portability and consistent performance when deployed on a remote AWS EC2 cloud server. The system leverages the scalability of Amazon Web Services to provide a reliable platform for modern web applications.

Introduction

In modern software development, deployment is as critical as the code itself. Many applications fail not because of bugs, but due to improper environment configurations. This project utilizes DevOps principles—specifically containerization and cloud computing—to create a robust deployment pipeline that is automated, reliable, and efficient. By moving away from manual setups, developers can ensure that their software runs the same way regardless of the underlying hardware.

Problem Statement

Traditional deployment methods often suffer from:

Environment Mismatch: The "it works on my machine" problem where applications behave differently across different OS or hardware.

Complexity: Manual dependency management is error-prone, slow, and difficult to document.

Scalability: Traditional manual setups are difficult to scale or replicate across multiple servers.

Downtime: Updates often require stopping the entire service, leading to loss of availability.

Existing System

The existing system typically involves setting up a physical or virtual server and manually installing the runtime environment, libraries, and application code. This "Bare Metal" or standard Virtual Machine approach requires a detailed manual of steps that must be followed perfectly every time a new server is added.

Limitations of Existing System

The limitations include:

Dependency Hell: Conflicting versions of libraries across different applications on the same server.

Resource Inefficiency: Virtual Machines require a full OS for every instance, wasting RAM and CPU.

Configuration Drift: Over time, servers that started identical become different due to manual patches.

Lack of Isolation: A failure in one application can potentially crash the entire host system.

Proposed System

The proposed system utilizes Docker to create a lightweight, isolated container for the application. This container is then deployed on an AWS EC2 instance. This approach ensures that the application is decoupled from the host operating system, making it highly portable and easy to manage.

Objectives

To create a portable environment that remains consistent from development to production.

To automate the deployment process using Dockerfiles.

To utilize cloud infrastructure (AWS) for high availability and scalability.

To minimize the resource footprint of the application deployment.

To provide a secure environment using cloud-native firewalls and SSH.

Scope of Project

The scope includes the configuration of an AWS EC2 instance, the installation of the Docker engine on Ubuntu Linux, the creation of a custom Docker image for a Python application, and the final deployment of the containerized app. It also covers basic network security and performance validation.

Methodology

The project follows a systematic 5-phase approach:

Planning: Defining the application requirements and dependency list.

Infrastructure: Provisioning the AWS EC2 instance and configuring the network.

Environment Setup: Installing Docker and essential tools on the remote server.

Containerization: Writing the Dockerfile and building the application image.

Deployment: Running the container and validating the live application.

Technology Stack

Cloud Provider: AWS (Elastic Compute Cloud - EC2)

Operating System: Ubuntu Linux (Server Edition)

Containerization: Docker Engine

Base Image: Python 3.9-slim

Networking: SSH (Port 22), HTTP (Port 80)

Tools: Terminal/CLI, Docker Desktop (for local testing)

Core Concepts

Containerization: Encapsulating an application with its environment.
Cloud Computing: Delivering computing services over the internet for faster innovation.
DevOps: A set of practices that combines software development and IT operations.

AWS EC2 Detailed Explanation

AWS EC2 provides scalable computing capacity. It allows users to launch virtual servers, manage storage, and configure networking and security.

AMI (Amazon Machine Image): A template that contains the software configuration (OS, application server).

Security Groups: Act as a virtual firewall for the instance to control inbound and outbound traffic.

Key Pairs: RSA keys used for secure SSH access.

Docker Detailed Explanation

Docker is a platform for developing, shipping, and running applications.

Docker Image: A read-only template with instructions for creating a Docker container.

Docker Container: A runnable instance of an image. Unlike VMs, containers share the host's OS kernel, making them extremely lightweight.

Dockerfile: A text document that contains all the commands a user could call on the command line to assemble an image.

Ubuntu Linux Fundamentals

Ubuntu is a popular open-source Linux distribution. This project utilizes its robust CLI to manage the Docker engine and network configurations. Key commands include:

apt: Advanced Package Tool for software management.

systemctl: Used to examine and control the state of the system and service manager.

ssh: Secure shell for remote command execution.

Implementation Plan

The plan involves creating a virtual server on AWS, ensuring it has the correct security ports open, installing Docker, pulling or building the application image, and finally running the application in a detached mode so it continues to run after the SSH session ends.

Step-by-Step Implementation

Phase 1: Infrastructure Setup

Launch EC2: Select an Ubuntu 22.04 LTS AMI. Choose a t2.micro instance (Free Tier eligible).

Security Group: Add a rule to allow HTTP (Port 80) from anywhere and SSH (Port 22) from your IP.

Key Pair: Download the .pem file for secure authentication.

Phase 2: Environment Configuration

Access the Server:

ssh -i "your-key.pem" ubuntu@your-ec2-public-dns


Update & Install Docker:

sudo apt update && sudo apt upgrade -y
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker


Phase 3: Containerization & Deployment

Create Dockerfile:

# Use official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy current directory contents into the container
COPY . /app

# Install needed packages
RUN pip install --no-cache-dir -r requirements.txt

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Run the application
CMD ["python", "app.py"]


Build and Run:

# Build the image
sudo docker build -t my-python-app .

# Run the container (Map Host 80 to Container 8000)
sudo docker run -d -p 80:8000 --name web-server my-python-app


Security and Networking

Firewall (Security Groups): Port 80 is opened specifically for public web traffic, while all other ports remain closed.

Key-Based Auth: Password login is disabled; only users with the private .pem key can access the server.

Isolation: If the application is compromised, the attacker is trapped inside the container, protecting the host OS.

Testing and Validation

Status Check: Run sudo docker ps to ensure the container is "Up".

Browser Test: Enter the EC2 Public IP in your browser to verify the application page.

Log Monitoring: Use sudo docker logs web-server to view application output and debug any internal errors.

Results and Observations

The application was successfully deployed and reachable via the public internet. Deployment time was significantly reduced compared to manual methods. The environment remained consistent regardless of the local machine used for initial development.

Benefits of the System

Consistency: Identical environments across development, testing, and production.

Speed: Containers start up in seconds rather than minutes.

Resource Efficiency: Multiple containers can run on a single EC2 instance without interfering with each other.

Scalability: Easy to replicate the same container across hundreds of instances if needed.

Comparative Analysis

Feature

Traditional System (VM)

Docker Container

Setup

Manual, slow, and inconsistent

Automated via Dockerfile

Portability

Low (Tied to Guest OS)

High (Run anywhere)

Weight

Heavy (GBs)

Lightweight (MBs)

Startup Time

Minutes

Seconds

Resource Usage

High (High overhead)

Efficient (Shared Kernel)

Performance Analysis

Docker containers provide faster startup and better performance due to their lightweight architecture. They do not require a separate OS kernel, which reduces the CPU and RAM overhead significantly compared to traditional Virtual Machines.

Cost Analysis

Using AWS Free Tier (t2.micro) keeps the initial cost at zero. Furthermore, because Docker is more efficient with resources, you can run more services on a smaller instance, reducing the overall cloud bill in a production setting.

Challenges Faced

Docker Permission Issues: Resolving the need for 'sudo' or adding users to the docker group.

Network Configuration: Correctly mapping the container ports to the AWS host ports.

Key Management: Managing the security and accessibility of the .pem file.

Limitations

Single Node: This deployment is on a single EC2 instance and lacks auto-scaling and high availability.

State Management: Storing data inside a container is not permanent; external volumes are needed for persistent storage.

Network Latency: Slight overhead due to the container networking bridge.

Future Enhancements

CI/CD Integration: Automatically deploy changes using GitHub Actions or Jenkins.

Orchestration: Transition to Kubernetes (EKS) for managing multiple containers and auto-scaling.

Monitoring: Implement tools like Prometheus and Grafana for real-time health tracking.

Real World Applications

Microservices Architecture: Breaking down large applications into small, manageable containers.

SaaS Platforms: Deploying customer-specific instances quickly.

Development Environments: Giving every developer an identical local setup in minutes.

Conclusion

This project successfully demonstrates a robust method for deploying cloud-native applications. By combining the scalability of AWS with the portability of Docker, we ensure a reliable deployment process that aligns with modern DevOps practices.