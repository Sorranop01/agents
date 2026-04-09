#!/bin/bash

# Kimi MCP Hierarchical Agents Installation Script
# This script automates the installation process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print functions
print_header() {
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║     Kimi MCP Hierarchical Agents Installer                ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        echo "Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version must be 18 or higher"
        echo "Current version: $(node --version)"
        exit 1
    fi
    print_success "Node.js $(node --version) found"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    print_success "npm $(npm --version) found"
    
    # Check git (optional)
    if command -v git &> /dev/null; then
        print_success "git found"
    else
        print_info "git not found (optional)"
    fi
}

# Create directory structure
create_directories() {
    print_info "Creating directory structure..."
    
    mkdir -p config/{agents,tasks,styles}
    mkdir -p src/{agents,mcp-servers,utils}
    mkdir -p tests
    mkdir -p logs
    mkdir -p docs
    
    print_success "Directory structure created"
}

# Install dependencies
install_dependencies() {
    print_info "Installing dependencies..."
    
    if [ -f "package.json" ]; then
        npm install
        print_success "Dependencies installed"
    else
        print_error "package.json not found"
        exit 1
    fi
}

# Setup environment
setup_environment() {
    print_info "Setting up environment..."
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_success ".env file created from example"
            print_info "Please edit .env and add your KIMI_API_KEY"
        else
            print_error ".env.example not found"
            exit 1
        fi
    else
        print_info ".env file already exists"
    fi
}

# Make scripts executable
make_scripts_executable() {
    print_info "Making scripts executable..."
    
    chmod +x src/mcp-servers/*.js 2>/dev/null || true
    chmod +x src/index.js 2>/dev/null || true
    
    print_success "Scripts made executable"
}

# Verify installation
verify_installation() {
    print_info "Verifying installation..."
    
    # Check if node_modules exists
    if [ -d "node_modules" ]; then
        print_success "node_modules directory exists"
    else
        print_error "node_modules directory not found"
        exit 1
    fi
    
    # Check key dependencies
    if [ -d "node_modules/@modelcontextprotocol" ]; then
        print_success "MCP SDK installed"
    else
        print_error "MCP SDK not found"
        exit 1
    fi
    
    print_success "Installation verified"
}

# Print next steps
print_next_steps() {
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║              Installation Complete!                       ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "Next steps:"
    echo ""
    echo "1. Edit .env file and add your KIMI_API_KEY:"
    echo "   nano .env"
    echo ""
    echo "2. Start the system:"
    echo "   npm start"
    echo ""
    echo "3. Start individual servers:"
    echo "   npm run start:orchestrator"
    echo "   npm run start:planner"
    echo "   npm run start:coder"
    echo "   npm run start:researcher"
    echo ""
    echo "4. Or start all servers:"
    echo "   npm run start:all"
    echo ""
    echo "5. Configure Kimi CLI:"
    echo "   kimi config set mcp.enabled true"
    echo "   kimi config set mcp.configPath $(pwd)/cline_mcp_settings.json"
    echo ""
    echo "Documentation:"
    echo "  - Quick Start: ./QUICKSTART.md"
    echo "  - Full Guide: ./kimi-cli-hierarchical-mcp-integration-guide.md"
    echo ""
}

# Main installation process
main() {
    print_header
    
    check_prerequisites
    create_directories
    install_dependencies
    setup_environment
    make_scripts_executable
    verify_installation
    
    print_next_steps
}

# Run main function
main "$@"
