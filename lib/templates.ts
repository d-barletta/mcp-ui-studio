import { Template } from './types';

export const templates: Template[] = [
  {
    id: 'contact-form',
    name: 'Contact Form',
    description: 'A professional contact form with validation',
    category: 'Forms',
    previewCode: `{
  "type": "form",
  "props": {
    "title": "Contact Us",
    "description": "Fill out the form below and we'll get back to you soon."
  },
  "children": [
    {
      "type": "input",
      "props": {
        "label": "Name",
        "placeholder": "John Doe",
        "required": true
      }
    },
    {
      "type": "input",
      "props": {
        "label": "Email",
        "type": "email",
        "placeholder": "john@example.com",
        "required": true
      }
    },
    {
      "type": "textarea",
      "props": {
        "label": "Message",
        "placeholder": "Your message here...",
        "rows": 4
      }
    },
    {
      "type": "button",
      "props": {
        "text": "Send Message",
        "variant": "primary"
      }
    }
  ]
}`,
    mcpui: {
      type: 'form',
      props: {
        title: 'Contact Us',
        description: "Fill out the form below and we'll get back to you soon."
      },
      children: [
        {
          type: 'input',
          props: {
            label: 'Name',
            placeholder: 'John Doe',
            required: true
          }
        },
        {
          type: 'input',
          props: {
            label: 'Email',
            type: 'email',
            placeholder: 'john@example.com',
            required: true
          }
        },
        {
          type: 'textarea',
          props: {
            label: 'Message',
            placeholder: 'Your message here...',
            rows: 4
          }
        },
        {
          type: 'button',
          props: {
            text: 'Send Message',
            variant: 'primary'
          }
        }
      ]
    }
  },
  {
    id: 'login-form',
    name: 'Login Form',
    description: 'Simple login form with email and password',
    category: 'Forms',
    previewCode: `{
  "type": "form",
  "props": {
    "title": "Welcome Back",
    "description": "Sign in to your account"
  },
  "children": [
    {
      "type": "input",
      "props": {
        "label": "Email",
        "type": "email",
        "placeholder": "you@example.com"
      }
    },
    {
      "type": "input",
      "props": {
        "label": "Password",
        "type": "password",
        "placeholder": "••••••••"
      }
    },
    {
      "type": "button",
      "props": {
        "text": "Sign In",
        "variant": "primary"
      }
    }
  ]
}`,
    mcpui: {
      type: 'form',
      props: {
        title: 'Welcome Back',
        description: 'Sign in to your account'
      },
      children: [
        {
          type: 'input',
          props: {
            label: 'Email',
            type: 'email',
            placeholder: 'you@example.com'
          }
        },
        {
          type: 'input',
          props: {
            label: 'Password',
            type: 'password',
            placeholder: '••••••••'
          }
        },
        {
          type: 'button',
          props: {
            text: 'Sign In',
            variant: 'primary'
          }
        }
      ]
    }
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Analytics dashboard with stats cards',
    category: 'Dashboards',
    previewCode: `{
  "type": "container",
  "props": {
    "title": "Dashboard Overview"
  },
  "children": [
    {
      "type": "stats-grid",
      "children": [
        {
          "type": "stat-card",
          "props": {
            "title": "Total Users",
            "value": "12,543",
            "change": "+12.5%",
            "trend": "up"
          }
        },
        {
          "type": "stat-card",
          "props": {
            "title": "Revenue",
            "value": "$45,231",
            "change": "+8.2%",
            "trend": "up"
          }
        },
        {
          "type": "stat-card",
          "props": {
            "title": "Active Sessions",
            "value": "1,234",
            "change": "-2.4%",
            "trend": "down"
          }
        },
        {
          "type": "stat-card",
          "props": {
            "title": "Conversion Rate",
            "value": "3.24%",
            "change": "+0.8%",
            "trend": "up"
          }
        }
      ]
    }
  ]
}`,
    mcpui: {
      type: 'container',
      props: {
        title: 'Dashboard Overview'
      },
      children: [
        {
          type: 'stats-grid',
          children: [
            {
              type: 'stat-card',
              props: {
                title: 'Total Users',
                value: '12,543',
                change: '+12.5%',
                trend: 'up'
              }
            },
            {
              type: 'stat-card',
              props: {
                title: 'Revenue',
                value: '$45,231',
                change: '+8.2%',
                trend: 'up'
              }
            },
            {
              type: 'stat-card',
              props: {
                title: 'Active Sessions',
                value: '1,234',
                change: '-2.4%',
                trend: 'down'
              }
            },
            {
              type: 'stat-card',
              props: {
                title: 'Conversion Rate',
                value: '3.24%',
                change: '+0.8%',
                trend: 'up'
              }
            }
          ]
        }
      ]
    }
  },
  {
    id: 'wizard',
    name: 'Multi-Step Wizard',
    description: 'Multi-step form wizard with progress indicator',
    category: 'Wizards',
    previewCode: `{
  "type": "wizard",
  "props": {
    "title": "Setup Wizard",
    "steps": ["Personal Info", "Preferences", "Review"]
  },
  "children": [
    {
      "type": "wizard-step",
      "props": {
        "title": "Personal Information"
      },
      "children": [
        {
          "type": "input",
          "props": {
            "label": "Full Name",
            "placeholder": "Enter your name"
          }
        },
        {
          "type": "input",
          "props": {
            "label": "Email",
            "type": "email"
          }
        }
      ]
    },
    {
      "type": "wizard-step",
      "props": {
        "title": "Preferences"
      },
      "children": [
        {
          "type": "select",
          "props": {
            "label": "Theme",
            "options": ["Light", "Dark", "Auto"]
          }
        },
        {
          "type": "checkbox",
          "props": {
            "label": "Enable notifications"
          }
        }
      ]
    },
    {
      "type": "wizard-step",
      "props": {
        "title": "Review & Submit"
      },
      "children": [
        {
          "type": "text",
          "props": {
            "content": "Please review your information before submitting."
          }
        }
      ]
    }
  ]
}`,
    mcpui: {
      type: 'wizard',
      props: {
        title: 'Setup Wizard',
        steps: ['Personal Info', 'Preferences', 'Review']
      },
      children: [
        {
          type: 'wizard-step',
          props: {
            title: 'Personal Information'
          },
          children: [
            {
              type: 'input',
              props: {
                label: 'Full Name',
                placeholder: 'Enter your name'
              }
            },
            {
              type: 'input',
              props: {
                label: 'Email',
                type: 'email'
              }
            }
          ]
        },
        {
          type: 'wizard-step',
          props: {
            title: 'Preferences'
          },
          children: [
            {
              type: 'select',
              props: {
                label: 'Theme',
                options: ['Light', 'Dark', 'Auto']
              }
            },
            {
              type: 'checkbox',
              props: {
                label: 'Enable notifications'
              }
            }
          ]
        },
        {
          type: 'wizard-step',
          props: {
            title: 'Review & Submit'
          },
          children: [
            {
              type: 'text',
              props: {
                content: 'Please review your information before submitting.'
              }
            }
          ]
        }
      ]
    }
  },
  {
    id: 'data-table',
    name: 'Data Table',
    description: 'Interactive data table with sorting and filtering',
    category: 'Tables',
    previewCode: `{
  "type": "table",
  "props": {
    "title": "User Management",
    "columns": ["Name", "Email", "Role", "Status"],
    "sortable": true,
    "filterable": true
  },
  "children": [
    {
      "type": "table-row",
      "props": {
        "data": ["John Doe", "john@example.com", "Admin", "Active"]
      }
    },
    {
      "type": "table-row",
      "props": {
        "data": ["Jane Smith", "jane@example.com", "User", "Active"]
      }
    },
    {
      "type": "table-row",
      "props": {
        "data": ["Bob Johnson", "bob@example.com", "User", "Inactive"]
      }
    }
  ]
}`,
    mcpui: {
      type: 'table',
      props: {
        title: 'User Management',
        columns: ['Name', 'Email', 'Role', 'Status'],
        sortable: true,
        filterable: true
      },
      children: [
        {
          type: 'table-row',
          props: {
            data: ['John Doe', 'john@example.com', 'Admin', 'Active']
          }
        },
        {
          type: 'table-row',
          props: {
            data: ['Jane Smith', 'jane@example.com', 'User', 'Active']
          }
        },
        {
          type: 'table-row',
          props: {
            data: ['Bob Johnson', 'bob@example.com', 'User', 'Inactive']
          }
        }
      ]
    }
  },
  {
    id: 'settings',
    name: 'Settings Panel',
    description: 'User settings panel with various controls',
    category: 'Settings',
    previewCode: `{
  "type": "container",
  "props": {
    "title": "Account Settings"
  },
  "children": [
    {
      "type": "section",
      "props": {
        "title": "Profile"
      },
      "children": [
        {
          "type": "input",
          "props": {
            "label": "Display Name",
            "value": "John Doe"
          }
        },
        {
          "type": "textarea",
          "props": {
            "label": "Bio",
            "rows": 3
          }
        }
      ]
    },
    {
      "type": "section",
      "props": {
        "title": "Notifications"
      },
      "children": [
        {
          "type": "checkbox",
          "props": {
            "label": "Email notifications",
            "checked": true
          }
        },
        {
          "type": "checkbox",
          "props": {
            "label": "Push notifications",
            "checked": false
          }
        }
      ]
    }
  ]
}`,
    mcpui: {
      type: 'container',
      props: {
        title: 'Account Settings'
      },
      children: [
        {
          type: 'section',
          props: {
            title: 'Profile'
          },
          children: [
            {
              type: 'input',
              props: {
                label: 'Display Name',
                value: 'John Doe'
              }
            },
            {
              type: 'textarea',
              props: {
                label: 'Bio',
                rows: 3
              }
            }
          ]
        },
        {
          type: 'section',
          props: {
            title: 'Notifications'
          },
          children: [
            {
              type: 'checkbox',
              props: {
                label: 'Email notifications',
                checked: true
              }
            },
            {
              type: 'checkbox',
              props: {
                label: 'Push notifications',
                checked: false
              }
            }
          ]
        }
      ]
    }
  },
  {
    id: 'card-gallery',
    name: 'Card Gallery',
    description: 'Grid of cards with images and actions',
    category: 'Cards',
    previewCode: `{
  "type": "grid",
  "props": {
    "columns": 3
  },
  "children": [
    {
      "type": "card",
      "props": {
        "title": "Product 1",
        "description": "A great product",
        "image": "/placeholder1.jpg"
      },
      "children": [
        {
          "type": "button",
          "props": {
            "text": "View Details"
          }
        }
      ]
    },
    {
      "type": "card",
      "props": {
        "title": "Product 2",
        "description": "Another great product",
        "image": "/placeholder2.jpg"
      },
      "children": [
        {
          "type": "button",
          "props": {
            "text": "View Details"
          }
        }
      ]
    },
    {
      "type": "card",
      "props": {
        "title": "Product 3",
        "description": "Yet another product",
        "image": "/placeholder3.jpg"
      },
      "children": [
        {
          "type": "button",
          "props": {
            "text": "View Details"
          }
        }
      ]
    }
  ]
}`,
    mcpui: {
      type: 'grid',
      props: {
        columns: 3
      },
      children: [
        {
          type: 'card',
          props: {
            title: 'Product 1',
            description: 'A great product',
            image: '/placeholder1.jpg'
          },
          children: [
            {
              type: 'button',
              props: {
                text: 'View Details'
              }
            }
          ]
        },
        {
          type: 'card',
          props: {
            title: 'Product 2',
            description: 'Another great product',
            image: '/placeholder2.jpg'
          },
          children: [
            {
              type: 'button',
              props: {
                text: 'View Details'
              }
            }
          ]
        },
        {
          type: 'card',
          props: {
            title: 'Product 3',
            description: 'Yet another product',
            image: '/placeholder3.jpg'
          },
          children: [
            {
              type: 'button',
              props: {
                text: 'View Details'
              }
            }
          ]
        }
      ]
    }
  },
  {
    id: 'analytics',
    name: 'Analytics Charts',
    description: 'Dashboard with charts and metrics',
    category: 'Dashboards',
    previewCode: `{
  "type": "container",
  "props": {
    "title": "Analytics"
  },
  "children": [
    {
      "type": "chart",
      "props": {
        "type": "line",
        "title": "Traffic Over Time",
        "data": [
          {"label": "Jan", "value": 1200},
          {"label": "Feb", "value": 1900},
          {"label": "Mar", "value": 1500},
          {"label": "Apr", "value": 2200}
        ]
      }
    },
    {
      "type": "chart",
      "props": {
        "type": "bar",
        "title": "Revenue by Category",
        "data": [
          {"label": "Products", "value": 45000},
          {"label": "Services", "value": 32000},
          {"label": "Support", "value": 15000}
        ]
      }
    }
  ]
}`,
    mcpui: {
      type: 'container',
      props: {
        title: 'Analytics'
      },
      children: [
        {
          type: 'chart',
          props: {
            type: 'line',
            title: 'Traffic Over Time',
            data: [
              { label: 'Jan', value: 1200 },
              { label: 'Feb', value: 1900 },
              { label: 'Mar', value: 1500 },
              { label: 'Apr', value: 2200 }
            ]
          }
        },
        {
          type: 'chart',
          props: {
            type: 'bar',
            title: 'Revenue by Category',
            data: [
              { label: 'Products', value: 45000 },
              { label: 'Services', value: 32000 },
              { label: 'Support', value: 15000 }
            ]
          }
        }
      ]
    }
  },
  {
    id: 'notification-center',
    name: 'Notification Center',
    description: 'Notification feed with different types',
    category: 'Notifications',
    previewCode: `{
  "type": "container",
  "props": {
    "title": "Notifications"
  },
  "children": [
    {
      "type": "notification",
      "props": {
        "type": "success",
        "title": "Profile Updated",
        "message": "Your profile has been successfully updated.",
        "timestamp": "2 minutes ago"
      }
    },
    {
      "type": "notification",
      "props": {
        "type": "warning",
        "title": "Action Required",
        "message": "Please verify your email address.",
        "timestamp": "1 hour ago"
      }
    },
    {
      "type": "notification",
      "props": {
        "type": "info",
        "title": "New Feature",
        "message": "Check out our new dashboard!",
        "timestamp": "1 day ago"
      }
    }
  ]
}`,
    mcpui: {
      type: 'container',
      props: {
        title: 'Notifications'
      },
      children: [
        {
          type: 'notification',
          props: {
            type: 'success',
            title: 'Profile Updated',
            message: 'Your profile has been successfully updated.',
            timestamp: '2 minutes ago'
          }
        },
        {
          type: 'notification',
          props: {
            type: 'warning',
            title: 'Action Required',
            message: 'Please verify your email address.',
            timestamp: '1 hour ago'
          }
        },
        {
          type: 'notification',
          props: {
            type: 'info',
            title: 'New Feature',
            message: 'Check out our new dashboard!',
            timestamp: '1 day ago'
          }
        }
      ]
    }
  }
];
