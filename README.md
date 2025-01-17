
# Inventory Management System

This is a simple **Inventory Management System (IMS)** server powered by Python with the FastAPI web framework. 

## Features

* **Web-Based**: It is a web-based system that can easily be accessed through web browsers, and there's no need to install software.
* **Real-Time Updates**: The system provides real-time updates on inventory and orders.
* **Order History**: Easily add new orders or edit an existing order.
* **Product Listing**: Easily add new products or edit an existing product.

##### Account
* **Account Authentication**: Account authentication is implemented to ensure secure access to the system, allowing only authorized users to view and manage inventory data.
* **Access Timeout**: If the user has been idle for `15 minutes` (can be changed on the `config.ini`) it will automatically logout the user.

## Installation

### It is recommeded to create a virtual environment
Creating the virtual environment
```
py -m venv .venv
```

Activating the virtual environment
```
.venv\Scripts\activate
```

install the requirements.

```
pip install -r requirements.txt
```

## Usage

Running the server

```
python main.py
```

If it's running locally you can access the server on http://localhost:8000/

## Dependencies

#### Programs
* [Python>=3.10](https://www.python.org/)

#### Python Dependencies

The framework and libraries used by this system.
* [FastAPI](https://fastapi.tiangolo.com/)
* [TinyDB](https://tinydb.readthedocs.io/en/latest/)
* [Watchdog](https://github.com/gorakhargosh/watchdog)
* [Cryptography](https://cryptography.io/en/latest/)