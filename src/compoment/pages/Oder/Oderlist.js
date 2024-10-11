import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const Oderlist = () => {

    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    // Gọi API lấy dữ liệu đơn hàng
    const fetchOrders = async () => {
        try {
            const response = await axios.get('https://projectky320240926105522.azurewebsites.net/api/Order');
            setOrders(response.data);
            console.log('Orders fetched successfully:', response.data);
        } catch (error) {
            console.error('Error fetching orders:', error.response?.data || error.message);
        }
    };

    // Gọi API lấy dữ liệu người dùng
    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://projectky320240926105522.azurewebsites.net/api/User');
            setUsers(response.data);
            console.log('Users fetched successfully:', response.data);
        } catch (error) {
            console.error('Error fetching users:', error.response?.data || error.message);
        }
    };

    useEffect(() => {
        // Gọi cả hai API khi component được mount
        fetchOrders();
        fetchUsers();
    }, []);
    const handleViewClick = (order) => {
        // Điều hướng tới trang chi tiết với state truyền đi
        navigate(`/OrderDetails/${order.orderId}`, { state: { order } });
    };


    const menuRef = useRef(null);
    const [menuState, setMenuState] = useState(() => {
        // Lấy trạng thái menu từ localStorage hoặc sử dụng trạng thái mặc định nếu chưa lưu
        const savedMenuState = localStorage.getItem('menuState');
        return savedMenuState ? JSON.parse(savedMenuState) : {
            dashboard: false,
            layouts: false,
            frontPages: false,
            ecommerce: false,
            settings: false,
            order: false,
            Customer: false
        };
    });
    // Hàm xử lý toggle cho từng menu
    const handleMenuToggle = (menuName) => {
        setMenuState((prevState) => {
            const newState = {
                ...prevState,
                [menuName]: !prevState[menuName], // Đảo ngược trạng thái của menu được click
            };
            // Lưu trạng thái menu mới vào localStorage
            localStorage.setItem('menuState', JSON.stringify(newState));
            return newState;
        });
    };

    useEffect(() => {
        const menuInner = menuRef.current;

        // Kiểm tra nếu nội dung vượt quá chiều cao của container
        if (menuInner.scrollHeight > menuInner.clientHeight) {
            menuInner.style.overflowY = 'auto';
        } else {
            menuInner.style.overflowY = 'hidden';
        }

        // Lấy vị trí cuộn từ localStorage và đặt lại
        const savedScrollPosition = localStorage.getItem('menuScrollPosition');
        if (savedScrollPosition) {
            menuInner.scrollTop = parseInt(savedScrollPosition, 10);
        }

        // Lưu vị trí cuộn trước khi trang được tải lại
        const handleBeforeUnload = () => {
            localStorage.setItem('menuScrollPosition', menuInner.scrollTop);
        };

        const handleResize = () => {
            if (menuInner.scrollHeight > menuInner.clientHeight) {
                menuInner.style.overflowY = 'auto';
            } else {
                menuInner.style.overflowY = 'hidden';
            }
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Cleanup event listener
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);
    return (
        <div className="layout-wrapper layout-content-navbar">
            <div className="layout-container">
                <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme" data-bg-class="bg-menu-theme">
                    <div className="app-brand demo">
                        <a href="index.html" className="app-brand-link">
                            <span className="app-brand-logo demo">
                                <svg
                                    width={25}
                                    viewBox="0 0 25 42"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                >
                                    <defs>
                                        <path
                                            d="M13.7918663,0.358365126 L3.39788168,7.44174259 C0.566865006,9.69408886 -0.379795268,12.4788597 0.557900856,15.7960551 C0.68998853,16.2305145 1.09562888,17.7872135 3.12357076,19.2293357 C3.8146334,19.7207684 5.32369333,20.3834223 7.65075054,21.2172976 L7.59773219,21.2525164 L2.63468769,24.5493413 C0.445452254,26.3002124 0.0884951797,28.5083815 1.56381646,31.1738486 C2.83770406,32.8170431 5.20850219,33.2640127 7.09180128,32.5391577 C8.347334,32.0559211 11.4559176,30.0011079 16.4175519,26.3747182 C18.0338572,24.4997857 18.6973423,22.4544883 18.4080071,20.2388261 C17.963753,17.5346866 16.1776345,15.5799961 13.0496516,14.3747546 L10.9194936,13.4715819 L18.6192054,7.984237 L13.7918663,0.358365126 Z"
                                            id="path-1"
                                        />
                                        <path
                                            d="M5.47320593,6.00457225 C4.05321814,8.216144 4.36334763,10.0722806 6.40359441,11.5729822 C8.61520715,12.571656 10.0999176,13.2171421 10.8577257,13.5094407 L15.5088241,14.433041 L18.6192054,7.984237 C15.5364148,3.11535317 13.9273018,0.573395879 13.7918663,0.358365126 C13.5790555,0.511491653 10.8061687,2.3935607 5.47320593,6.00457225 Z"
                                            id="path-3"
                                        />
                                        <path
                                            d="M7.50063644,21.2294429 L12.3234468,23.3159332 C14.1688022,24.7579751 14.397098,26.4880487 13.008334,28.506154 C11.6195701,30.5242593 10.3099883,31.790241 9.07958868,32.3040991 C5.78142938,33.4346997 4.13234973,34 4.13234973,34 C4.13234973,34 2.75489982,33.0538207 2.37032616e-14,31.1614621 C-0.55822714,27.8186216 -0.55822714,26.0572515 -4.05231404e-15,25.8773518 C0.83734071,25.6075023 2.77988457,22.8248993 3.3049379,22.52991 C3.65497346,22.3332504 5.05353963,21.8997614 7.50063644,21.2294429 Z"
                                            id="path-4"
                                        />
                                        <path
                                            d="M20.6,7.13333333 L25.6,13.8 C26.2627417,14.6836556 26.0836556,15.9372583 25.2,16.6 C24.8538077,16.8596443 24.4327404,17 24,17 L14,17 C12.8954305,17 12,16.1045695 12,15 C12,14.5672596 12.1403557,14.1461923 12.4,13.8 L17.4,7.13333333 C18.0627417,6.24967773 19.3163444,6.07059163 20.2,6.73333333 C20.3516113,6.84704183 20.4862915,6.981722 20.6,7.13333333 Z"
                                            id="path-5"
                                        />
                                    </defs>
                                    <g
                                        id="g-app-brand"
                                        stroke="none"
                                        strokeWidth={1}
                                        fill="none"
                                        fillRule="evenodd"
                                    >
                                        <g id="Brand-Logo" transform="translate(-27.000000, -15.000000)">
                                            <g id="Icon" transform="translate(27.000000, 15.000000)">
                                                <g id="Mask" transform="translate(0.000000, 8.000000)">
                                                    <mask id="mask-2" fill="white">
                                                        <use xlinkHref="#path-1" />
                                                    </mask>
                                                    <use fill="#696cff" xlinkHref="#path-1" />
                                                    <g id="Path-3" mask="url(#mask-2)">
                                                        <use fill="#696cff" xlinkHref="#path-3" />
                                                        <use fillOpacity="0.2" fill="#FFFFFF" xlinkHref="#path-3" />
                                                    </g>
                                                    <g id="Path-4" mask="url(#mask-2)">
                                                        <use fill="#696cff" xlinkHref="#path-4" />
                                                        <use fillOpacity="0.2" fill="#FFFFFF" xlinkHref="#path-4" />
                                                    </g>
                                                </g>
                                                <g
                                                    id="Triangle"
                                                    transform="translate(19.000000, 11.000000) rotate(-300.000000) translate(-19.000000, -11.000000) "
                                                >
                                                    <use fill="#696cff" xlinkHref="#path-5" />
                                                    <use fillOpacity="0.2" fill="#FFFFFF" xlinkHref="#path-5" />
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </span>
                            <span className="app-brand-text demo menu-text fw-bold ms-2">sneat</span>
                        </a>

                        <a href="javascript:void(0);" className="layout-menu-toggle menu-link text-large ms-auto d-xl-none">
                            <i className="bx bx-chevron-left bx-sm d-flex align-items-center justify-content-center"></i>
                        </a>
                    </div>

                    <div className="menu-inner-shadow" style={{ display: "none" }}></div>

                    {/* Menu Inner */}
                    <ul className="menu-inner py-1" ref={menuRef} style={{ maxHeight: "700px" }}>
                        

                        <li className={`menu-item ${menuState.ecommerce ? 'open' : ''}`}>
                            <a href="#" className="menu-link menu-toggle" onClick={(e) => { e.preventDefault(); handleMenuToggle('ecommerce'); }}>
                                <i className="menu-icon tf-icons bx bx-cart-alt" />
                                <div className="text-truncate" data-i18n="eCommerce">
                                    eCommerce
                                </div>
                            </a>
                            <ul className="menu-sub">
                                <li className="menu-item">
                                    <a href="/Commerce" className="menu-link">
                                        <div className="text-truncate" data-i18n="Dashboard">
                                            Dashboard
                                        </div>
                                    </a>
                                </li>
                                <li className={`menu-item ${menuState.frontPages ? 'open' : ''}`}>
                                    <a href="#" className="menu-link menu-toggle" onClick={(e) => { e.preventDefault(); handleMenuToggle('frontPages'); }}>
                                        <div className="text-truncate" data-i18n="Products">
                                            Products
                                        </div>
                                    </a>
                                    <ul className="menu-sub">
                                        <li className="menu-item">
                                            <a href="/Product" className="menu-link">
                                                <div className="text-truncate" data-i18n="Product List">
                                                    Product List
                                                </div>
                                            </a>
                                        </li>
                                        <li className="menu-item ">
                                            <a href="/Addproduct" className="menu-link">
                                                <div className="text-truncate" data-i18n="Add Product">
                                                    Add Product
                                                </div>
                                            </a>
                                        </li>
                                        <li className="menu-item">
                                            <a href="/Catenorylist" className="menu-link">
                                                <div className="text-truncate" data-i18n="Category List">
                                                    Category List
                                                </div>
                                            </a>
                                        </li>
                                        <li className="menu-item ">
                                            <a href="/Brandlist" className="menu-link">
                                                <div className="text-truncate" data-i18n="Category List">
                                                    Brand List
                                                </div>
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li className={`menu-item ${menuState.order ? 'open' : ''}`}>
                                    <a href="#" className="menu-link menu-toggle" onClick={(e) => { e.preventDefault(); handleMenuToggle('order'); }}>
                                        <div className="text-truncate" data-i18n="Order">
                                            Order
                                        </div>
                                    </a>
                                    <ul className="menu-sub">
                                        <li className="menu-item active">
                                            <a href="/Oderlist" className="menu-link">
                                                <div className="text-truncate" data-i18n="Order List">
                                                    Order List
                                                </div>
                                            </a>
                                        </li>

                                        <li className="menu-item ">
                                            <a href="/Oderdetails" className="menu-link">
                                                <div className="text-truncate" data-i18n="Order Details">
                                                    Order Details
                                                </div>
                                            </a>
                                        </li>
                                    </ul>

                                </li>

                                
                            </ul>
                        </li>


                        <div className="ps__rail-x" style={{ left: 0, bottom: 0 }}>
                            <div className="ps__thumb-x" tabIndex={0} style={{ left: 0, width: 0 }} />
                        </div>
                        <div className="ps__rail-y" style={{ top: 0, height: 254, right: 4 }}>
                            <div
                                className="ps__thumb-y"
                                tabIndex={0}
                                style={{ top: 0, height: 44 }}
                            />
                        </div>
                    </ul>
                </aside>
                <div className="layout-page">
                    {/* Navbar */}
                    <nav className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
                        <div className="layout-menu-toggle navbar-nav align-items-xl-center me-4 me-xl-0 d-xl-none">
                            <a className="nav-item nav-link px-0 me-xl-6" href="javascript:void(0)">
                                <i className="bx bx-menu bx-md"></i>
                            </a>
                        </div>

                        
                    </nav>
                    {/* / Navbar */}
                    {/* Content wrapper */}
                    <div className="content-wrapper">
                        {/* Content */}
                        <div className="container-xxl flex-grow-1 container-p-y">
                            {/* Order List Widget */}
                            <div className="card mb-6">
                                <div className="card-widget-separator-wrapper">
                                    <div className="card-body card-widget-separator">
                                        <div className="row gy-4 gy-sm-1">
                                            <div className="col-sm-6 col-lg-3">
                                                <div className="d-flex justify-content-between align-items-start card-widget-1 border-end pb-4 pb-sm-0">
                                                    <div>
                                                        <h4 className="mb-0">56</h4>
                                                        <p className="mb-0">Pending Payment</p>
                                                    </div>
                                                    <span className="avatar w-px-40 h-px-40 me-sm-6">
                                                        <span className="avatar-initial bg-label-secondary rounded">
                                                            <i className="bx bx-calendar bx-lg text-heading" />
                                                        </span>
                                                    </span>
                                                </div>
                                                <hr className="d-none d-sm-block d-lg-none me-6" />
                                            </div>
                                            <div className="col-sm-6 col-lg-3">
                                                <div className="d-flex justify-content-between align-items-start card-widget-2 border-end pb-4 pb-sm-0">
                                                    <div>
                                                        <h4 className="mb-0">12,689</h4>
                                                        <p className="mb-0">Completed</p>
                                                    </div>
                                                    <span className="avatar w-px-40 h-px-40 p-2 me-lg-6">
                                                        <span className="avatar-initial bg-label-secondary rounded">
                                                            <i className="bx bx-check-double bx-lg text-heading" />
                                                        </span>
                                                    </span>
                                                </div>
                                                <hr className="d-none d-sm-block d-lg-none" />
                                            </div>
                                            <div className="col-sm-6 col-lg-3">
                                                <div className="d-flex justify-content-between align-items-start border-end pb-4 pb-sm-0 card-widget-3">
                                                    <div>
                                                        <h4 className="mb-0">124</h4>
                                                        <p className="mb-0">Refunded</p>
                                                    </div>
                                                    <span className="avatar w-px-40 h-px-40 p-2 me-sm-6">
                                                        <span className="avatar-initial bg-label-secondary rounded">
                                                            <i className="bx bx-wallet bx-lg text-heading" />
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 col-lg-3">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div>
                                                        <h4 className="mb-0">32</h4>
                                                        <p className="mb-0">Failed</p>
                                                    </div>
                                                    <span className="avatar w-px-40 h-px-40 p-2">
                                                        <span className="avatar-initial bg-label-secondary rounded">
                                                            <i className="bx bx-error-alt bx-lg text-heading" />
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Order List Table */}
                            <div className="card">
                                <div className="card-datatable table-responsive">
                                    <div
                                        id="DataTables_Table_0_wrapper"
                                        className="dataTables_wrapper dt-bootstrap5 no-footer"
                                    >
                                        <div className="card-header py-0 d-flex flex-column flex-md-row align-items-center">
                                            <div>
                                                <div
                                                    id="DataTables_Table_0_filter"
                                                    className="dataTables_filter ms-n3 mb-0 mb-md-6"
                                                >
                                                    <label>
                                                        <input
                                                            type="search"
                                                            className="form-control"
                                                            placeholder="Search Order"
                                                            aria-controls="DataTables_Table_0"
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-md-end gap-2 justify-content-center">
                                                <div
                                                    className="dataTables_length ms-n2"
                                                    id="DataTables_Table_0_length"
                                                >
                                                    <label>
                                                        <select
                                                            name="DataTables_Table_0_length"
                                                            aria-controls="DataTables_Table_0"
                                                            className="form-select"
                                                        >
                                                            <option value={10}>10</option>
                                                            <option value={40}>40</option>
                                                            <option value={60}>60</option>
                                                            <option value={80}>80</option>
                                                            <option value={100}>100</option>
                                                        </select>
                                                    </label>
                                                </div>
                                                <div className="dt-action-buttons pt-0">
                                                    <div className="dt-buttons btn-group flex-wrap">
                                                        <div className="btn-group">
                                                            <button
                                                                className="btn btn-secondary buttons-collection dropdown-toggle btn-label-secondary"
                                                                tabIndex={0}
                                                                aria-controls="DataTables_Table_0"
                                                                type="button"
                                                                aria-haspopup="dialog"
                                                                aria-expanded="false"
                                                            >
                                                                <span>
                                                                    <i className="bx bx-export bx-sm me-2" />
                                                                    Export
                                                                </span>
                                                            </button>
                                                        </div>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <table
                                            className="datatables-order table border-top dataTable no-footer dtr-column collapsed"
                                            id="DataTables_Table_0"
                                            aria-describedby="DataTables_Table_0_info"
                                            style={{ width: 1151 }}
                                        >
                                            <thead>
                                                <tr>
                                                    <th
                                                        className="control sorting_disabled"
                                                        rowSpan={1}
                                                        colSpan={1}
                                                        style={{ width: 2 }}
                                                        aria-label=""
                                                    />
                                                    <th
                                                        className="sorting_disabled dt-checkboxes-cell dt-checkboxes-select-all"
                                                        rowSpan={1}
                                                        colSpan={1}
                                                        style={{ width: 18 }}
                                                        data-col={1}
                                                        aria-label=""
                                                    >
                                                        <input type="checkbox" className="form-check-input" />
                                                    </th>
                                                    <th
                                                        className="sorting"
                                                        tabIndex={0}
                                                        aria-controls="DataTables_Table_0"
                                                        rowSpan={1}
                                                        colSpan={1}
                                                        style={{ width: 49 }}
                                                        aria-label="order: activate to sort column ascending"
                                                    >
                                                        Order ID
                                                    </th>
                                                    <th
                                                        className="sorting sorting_asc"
                                                        tabIndex={0}
                                                        aria-controls="DataTables_Table_0"
                                                        rowSpan={1}
                                                        colSpan={1}
                                                        style={{ width: 122 }}
                                                        aria-label="date: activate to sort column descending"
                                                        aria-sort="ascending"
                                                    >
                                                        User Name
                                                    </th>
                                                    <th
                                                        className="sorting"
                                                        tabIndex={0}
                                                        aria-controls="DataTables_Table_0"
                                                        rowSpan={1}
                                                        colSpan={1}
                                                        style={{ width: 253 }}
                                                        aria-label="customers: activate to sort column ascending"
                                                    >
                                                        Email
                                                    </th>
                                                    <th
                                                        className="sorting"
                                                        tabIndex={0}
                                                        aria-controls="DataTables_Table_0"
                                                        rowSpan={1}
                                                        colSpan={1}
                                                        style={{ width: 99 }}
                                                        aria-label="payment: activate to sort column ascending"
                                                    >
                                                        Price
                                                    </th>
                                                    <th
                                                        className="sorting"
                                                        tabIndex={0}
                                                        aria-controls="DataTables_Table_0"
                                                        rowSpan={1}
                                                        colSpan={1}
                                                        style={{ width: 111 }}
                                                        aria-label="status: activate to sort column ascending"
                                                    >
                                                        Status
                                                    </th>
                                                    <th
                                                        className="sorting"
                                                        tabIndex={0}
                                                        aria-controls="DataTables_Table_0"
                                                        rowSpan={1}
                                                        colSpan={1}
                                                        style={{ width: 133 }}
                                                        aria-label="method: activate to sort column ascending"
                                                    >
                                                        Order Date
                                                    </th>
                                                    <th
                                                        className="sorting"
                                                        tabIndex={0}
                                                        aria-controls="DataTables_Table_0"
                                                        rowSpan={1}
                                                        colSpan={1}
                                                        style={{ width: 123 }}
                                                        aria-label="method: activate to sort column ascending"
                                                    >
                                                        Shipping Method
                                                    </th>
                                                    <th
                                                        className="sorting_disabled dtr-hidden"
                                                        rowSpan={1}
                                                        colSpan={1}
                                                        style={{ width: 0 }}
                                                        aria-label="Actions"
                                                    >
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.map((order) => {
                                                    // Tìm user tương ứng với userId từ đơn hàng
                                                    const user = users.find((u) => u.userId === order.userId);
                                                    return (
                                                        <tr key={order.orderId}>
                                                            <td></td>
                                                            <td></td>
                                                            <td>{order.orderId}</td>
                                                            <td>{user ? user.name : 'Unknown'}</td>
                                                            <td>{user ? user.email : 'N/A'}</td>
                                                            <td>{order.totalAmount}</td>
                                                            <td><span
                                                                className={`badge px-2 ${order.status === 'pending' ? 'badge bg-label-warning' :
                                                                        order.status === 'Cancelled'  ? 'badge bg-label-danger' :
                                                                        order.status === 'Order cancelled'  ? 'badge bg-label-danger' :
                                                                        order.status === 'Return Denied' ? 'badge bg-label-danger' :                                                                    
                                                                        order.status === 'Denied' ? 'badge bg-label-danger' :
                                                                        order.status === 'Return' ? 'badge bg-label-danger' :
                                                                                           'badge bg-label-success'
                                                                    }`}
                                                            >
                                                                {order.status}
                                                            </span></td>
                                                            <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                                            <td>{order.shippingMethod}</td>
                                                            <td className="dtr-hidden" >
                                                                <div className="d-flex justify-content-sm-start align-items-sm-center">
                                                                    <button className="btn btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                                        <i className="bx bx-dots-vertical-rounded bx-md" />
                                                                    </button>
                                                                    <div className="dropdown-menu dropdown-menu-end m-0">
                                                                        <a>
                                                                            <Link
                                                                                to={`/OrderDetails/${order.orderId}`}
                                                                                state={{ order }} // Truyền order qua state
                                                                                className="dropdown-item"
                                                                            >
                                                                                View
                                                                            </Link>
                                                                        </a>
                                                                       
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                        <div className="row">
                                            <div className="col-sm-12 col-md-6">
                                                <div
                                                    className="dataTables_info"
                                                    id="DataTables_Table_0_info"
                                                    role="status"
                                                    aria-live="polite"
                                                >
                                                    Displaying 1 to 10 of 100 entries
                                                </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6">
                                                <div
                                                    className="dataTables_paginate paging_simple_numbers"
                                                    id="DataTables_Table_0_paginate"
                                                >
                                                    <ul className="pagination">
                                                        <li
                                                            className="paginate_button page-item previous disabled"
                                                            id="DataTables_Table_0_previous"
                                                        >
                                                            <a
                                                                aria-controls="DataTables_Table_0"
                                                                aria-disabled="true"
                                                                role="link"
                                                                data-dt-idx="previous"
                                                                tabIndex={-1}
                                                                className="page-link"
                                                            >
                                                                <i className="bx bx-chevron-left bx-18px" />
                                                            </a>
                                                        </li>
                                                        <li className="paginate_button page-item active">
                                                            <a
                                                                href="#"
                                                                aria-controls="DataTables_Table_0"
                                                                role="link"
                                                                aria-current="page"
                                                                data-dt-idx={0}
                                                                tabIndex={0}
                                                                className="page-link"
                                                            >
                                                                1
                                                            </a>
                                                        </li>
                                                        <li className="paginate_button page-item ">
                                                            <a
                                                                href="#"
                                                                aria-controls="DataTables_Table_0"
                                                                role="link"
                                                                data-dt-idx={1}
                                                                tabIndex={0}
                                                                className="page-link"
                                                            >
                                                                2
                                                            </a>
                                                        </li>
                                                        <li className="paginate_button page-item ">
                                                            <a
                                                                href="#"
                                                                aria-controls="DataTables_Table_0"
                                                                role="link"
                                                                data-dt-idx={2}
                                                                tabIndex={0}
                                                                className="page-link"
                                                            >
                                                                3
                                                            </a>
                                                        </li>
                                                        <li className="paginate_button page-item ">
                                                            <a
                                                                href="#"
                                                                aria-controls="DataTables_Table_0"
                                                                role="link"
                                                                data-dt-idx={3}
                                                                tabIndex={0}
                                                                className="page-link"
                                                            >
                                                                4
                                                            </a>
                                                        </li>
                                                        <li className="paginate_button page-item ">
                                                            <a
                                                                href="#"
                                                                aria-controls="DataTables_Table_0"
                                                                role="link"
                                                                data-dt-idx={4}
                                                                tabIndex={0}
                                                                className="page-link"
                                                            >
                                                                5
                                                            </a>
                                                        </li>
                                                        <li
                                                            className="paginate_button page-item disabled"
                                                            id="DataTables_Table_0_ellipsis"
                                                        >
                                                            <a
                                                                aria-controls="DataTables_Table_0"
                                                                aria-disabled="true"
                                                                role="link"
                                                                data-dt-idx="ellipsis"
                                                                tabIndex={-1}
                                                                className="page-link"
                                                            >
                                                                …
                                                            </a>
                                                        </li>
                                                        <li className="paginate_button page-item ">
                                                            <a
                                                                href="#"
                                                                aria-controls="DataTables_Table_0"
                                                                role="link"
                                                                data-dt-idx={9}
                                                                tabIndex={0}
                                                                className="page-link"
                                                            >
                                                                10
                                                            </a>
                                                        </li>
                                                        <li
                                                            className="paginate_button page-item next"
                                                            id="DataTables_Table_0_next"
                                                        >
                                                            <a
                                                                href="#"
                                                                aria-controls="DataTables_Table_0"
                                                                role="link"
                                                                data-dt-idx="next"
                                                                tabIndex={0}
                                                                className="page-link"
                                                            >
                                                                <i className="bx bx-chevron-right bx-18px" />
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ width: "1%" }} />
                                        <div style={{ width: "1%" }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* / Content */}
                        {/* Footer */}
                        <footer className="content-footer footer bg-footer-theme">
                            <div className="container-xxl">
                                <div className="footer-container d-flex align-items-center justify-content-between py-4 flex-md-row flex-column">
                                    <div className="text-body">
                                        © 2024, made with ❤️ by{" "}
                                        <a
                                            href="https://themeselection.com"
                                            target="_blank"
                                            className="footer-link"
                                        >
                                            ThemeSelection
                                        </a>
                                    </div>
                                    <div className="d-none d-lg-inline-block">
                                        <a
                                            href="https://themeselection.com/license/"
                                            className="footer-link me-4"
                                            target="_blank"
                                        >
                                            License
                                        </a>
                                        <a
                                            href="https://themeselection.com/"
                                            target="_blank"
                                            className="footer-link me-4"
                                        >
                                            More Themes
                                        </a>
                                        <a
                                            href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/documentation/"
                                            target="_blank"
                                            className="footer-link me-4"
                                        >
                                            Documentation
                                        </a>
                                        <a
                                            href="https://themeselection.com/support/"
                                            target="_blank"
                                            className="footer-link d-none d-sm-inline-block"
                                        >
                                            Support
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </footer>
                        {/* / Footer */}
                        <div className="content-backdrop fade" />
                    </div>
                    {/* Content wrapper */}
                </div>


            </div>
        </div>
    )
}

export default Oderlist
