import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

const Oderdetails = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { order } = location.state || {};
    const [orderDetails, setOrderDetails] = useState(order);
    const [isConfirmed, setIsConfirmed] = useState(
        order.status === 'Confirmed' || order.status === 'Picked up' || order.status === 'Dispatched'
    );
    const [isPickup, setIsPickUP] = useState(order.status === 'Pick up')
    const [isDispatch, setDispatch] = useState(order.status === 'Dispatch')
    const [isArrived, setArrived] = useState(order.status === 'Arrived')
    const [isDenied, setIsDenied] = useState(false);
    const [confirmationTime, setConfirmationTime] = useState(null);
    console.log('API 1', order)
    // Hàm xử lý toggle cho từng menu
    const fetchProductDetails = async (productId) => {
        try {
            const response = await axios.get(`https://projectky320240926105522.azurewebsites.net/api/Product/${productId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching product with ID ${productId}:`, error);
        }
    };

    const fetchColorDetails = async (colorId) => {
        try {
            const response = await axios.get(`https://projectky320240926105522.azurewebsites.net/api/Color/${colorId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching color with ID ${colorId}:`, error);
        }
    };

    const fetchSizeDetails = async (sizeId) => {
        try {
            const response = await axios.get(`https://projectky320240926105522.azurewebsites.net/api/Size/${sizeId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching size with ID ${sizeId}:`, error);
        }
    };
    useEffect(() => {
        const fetchDetailsForOrderItems = async () => {
            if (order && order.orderItems.length > 0) {
                const updatedOrderItems = await Promise.all(order.orderItems.map(async (item) => {
                    const productDetails = await fetchProductDetails(item.variant.productId);
                    const colorDetails = await fetchColorDetails(item.variant.colorId);
                    const sizeDetails = await fetchSizeDetails(item.variant.sizeId);

                    return {
                        ...item,
                        variant: {
                            ...item.variant,
                            product: productDetails,
                            color: colorDetails,
                            size: sizeDetails,
                        },
                    };
                }));

                // Cập nhật state `orderDetails` với thông tin chi tiết mới
                setOrderDetails({
                    ...order,
                    orderItems: updatedOrderItems,
                });
            }
        };

        fetchDetailsForOrderItems();
    }, [order]);


    const fetchOrderDetails = async () => {
        try {
          const response = await axios.get(`https://projectky320240926105522.azurewebsites.net/api/Order/${order.orderId}`);
          setOrderDetails(response.data); // Cập nhật lại state với dữ liệu mới
        } catch (error) {
          console.error('Error fetching updated order:', error);
        }
      };
    const handleConfirmOrder = async () => {
        try {
            const response = await axios.post(`https://projectky320240926105522.azurewebsites.net/api/Order/confirm/${order.orderId}`);

            // Kiểm tra xem phản hồi có thành công hay không
            if (response.status === 200 || response.status === 204) {
                console.log('Order confirmed:', response.data);
                alert('Order confirmed successfully!');
                await fetchOrderDetails();
                setIsConfirmed(true);
                setConfirmationTime(new Date().toLocaleString());
                
                // Điều hướng đến trang OrderList sau khi xác nhận
            } else {
                console.error('Unexpected response:', response);
                alert('Failed to confirm order.');
            }
        } catch (error) {
            console.error('Error confirming order:', error.response?.data || error.message);
            alert('Failed to confirm order.');
        }


    };


    // Hàm từ chối đơn hàng
    const handleDenyOrder = async () => {
        try {
            const response = await axios.post(`https://projectky320240926105522.azurewebsites.net/api/Order/deny/${order.orderId}`);
            console.log('Order denied:', response.data);

            if (response.status === 200 || response.status === 204) {
                console.log('Order deny:', response.data);
                alert('Order deny successfully!');
                setIsDenied(true);

                navigate('/Oderlist'); // Điều hướng đến trang OrderList sau khi xác nhận
            } else {
                console.error('Unexpected response:', response);
                alert('Failed to confirm order.');
            }
        } catch (error) {
            console.error('Error denying order:', error);
            alert('Failed to deny order.');
        }
    };
    const handlePickupOrder = async () => {
        try {
            const response = await axios.post(`https://projectky320240926105522.azurewebsites.net/api/Order/pickUp/${order.orderId}`);
            console.log('Pick UP:', response.data);

            if (response.status === 200 || response.status === 204) {
                console.log('Order deny:', response.data);
                alert('Order PIck UP successfully!');
                setIsPickUP(true);

            } else {
                console.error('Unexpected response:', response);
                alert('Failed to confirm order.');
            }
        } catch (error) {
            console.error('Error denying order:', error);
            alert('Failed to deny order.');
        }
    };
    const handledispatchOrder = async () => {
        try {
            const response = await axios.post(`https://projectky320240926105522.azurewebsites.net/api/Order/dispatch/${order.orderId}`);
            console.log('dispatch:', response.data);

            if (response.status === 200 || response.status === 204) {
                console.log('Order deny:', response.data);
                alert('Order dispatch successfully!');
                setDispatch(true);

            } else {
                console.error('Unexpected response:', response);
                alert('Failed to confirm order.');
            }
        } catch (error) {
            console.error('Error denying order:', error);
            alert('Failed to deny order.');
        }
    };

    const handleArriveOrder = async () => {
        try {
            const response = await axios.post(`https://projectky320240926105522.azurewebsites.net/api/Order/arrive/${order.orderId}`);
            console.log('Package:', response.data);

            if (response.status === 200 || response.status === 204) {
                console.log('Order Package:', response.data);
                alert('Order dispatch successfully!');
                setArrived(true);

            } else {
                console.error('Unexpected response:', response);
                alert('Failed to Package order.');
            }
        } catch (error) {
            console.error('Error Package order:', error);
            alert('Failed to Package order.');
        }
    };
    useEffect(() => {
        // Kiểm tra trạng thái đơn hàng khi trang được render
        if (order.status) {
            setIsConfirmed(order.status === 'Confirmed' || order.status === 'Picked up' || order.status === 'Dispatched' || order.status === 'Arrived');
            setIsPickUP(order.status === 'Picked up' || order.status === 'Dispatched' || order.status === 'Arrived');
            setDispatch(order.status === 'Dispatched' || order.status === 'Arrived');
        }
    }, [order.status]);










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
            order: false
        };
    });

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
                        <li className={`menu-item ${menuState.dashboard ? 'open' : ''}`}>
                            <a href="#" className="menu-link menu-toggle" onClick={(e) => { e.preventDefault(); handleMenuToggle('dashboard'); }}>
                                <i className="menu-icon tf-icons bx bx-home-smile"></i>
                                <div className="text-truncate" data-i18n="Dashboards">Dashboards</div>
                                <span className="badge rounded-pill bg-danger ms-auto">5</span>
                            </a>
                            <ul className="menu-sub">
                                <li className="menu-item">
                                    <a href="index.html" className="menu-link">
                                        <div className="text-truncate" data-i18n="Analytics">Analytics</div>
                                    </a>
                                </li>
                                <li className="menu-item">
                                    <a href="https://demos.themeselection.com" target="_blank" className="menu-link">
                                        <div className="text-truncate" data-i18n="CRM">CRM</div>
                                    </a>
                                </li>
                                <li className="menu-item active">
                                    <a
                                        href="/Commerce"
                                        target="_blank"
                                        className="menu-link"
                                    >
                                        <div className="text-truncate" data-i18n="eCommerce">
                                            eCommerce
                                        </div>
                                    </a>
                                </li>
                                <li className="menu-item">
                                    <a
                                        href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/app-logistics-dashboard.html"
                                        target="_blank"
                                        className="menu-link"
                                    >
                                        <div className="text-truncate" data-i18n="Logistics">
                                            Logistics
                                        </div>
                                    </a>
                                </li>
                                <li className="menu-item">
                                    <a
                                        href="app-academy-dashboard.html"
                                        target="_blank"
                                        className="menu-link"
                                    >
                                        <div className="text-truncate" data-i18n="Academy">
                                            Academy
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </li>

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
                                        <li className="menu-item ">
                                            <a href="/Oderlist" className="menu-link">
                                                <div className="text-truncate" data-i18n="Order List">
                                                    Order List
                                                </div>
                                            </a>
                                        </li>
                                        <li className="menu-item active">
                                            <a href="/Oderdetails" className="menu-link">
                                                <div className="text-truncate" data-i18n="Order Details">
                                                    Order Details
                                                </div>
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                
                                <li className="menu-item">
                                    <a href="app-ecommerce-manage-reviews.html" className="menu-link">
                                        <div className="text-truncate" data-i18n="Manage Reviews">
                                            Manage Reviews
                                        </div>
                                    </a>
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
                    <nav
                        className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
                        id="layout-navbar"
                    >
                        <div className="layout-menu-toggle navbar-nav align-items-xl-center me-4 me-xl-0   d-xl-none ">
                            <a className="nav-item nav-link px-0 me-xl-6" href="javascript:void(0)">
                                <i className="bx bx-menu bx-md" />
                            </a>
                        </div>
                        
                        {/* Search Small Screens */}
                        <div className="navbar-search-wrapper search-input-wrapper d-none">
                            <span
                                className="twitter-typeahead"
                                style={{ position: "relative", display: "inline-block" }}
                            >
                                <input
                                    type="text"
                                    className="form-control search-input container-xxl border-0 tt-input"
                                    placeholder="Search..."
                                    aria-label="Search..."
                                    autoComplete="off"
                                    spellCheck="false"
                                    dir="auto"
                                    style={{ position: "relative", verticalAlign: "top" }}
                                    _mstplaceholder={99723}
                                    _mstaria-label={99723}
                                />
                                <pre
                                    aria-hidden="true"
                                    style={{
                                        position: "absolute",
                                        visibility: "hidden",
                                        whiteSpace: "pre",
                                        fontFamily:
                                            '"Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
                                        fontSize: 15,
                                        fontStyle: "normal",
                                        fontVariant: "normal",
                                        fontWeight: 400,
                                        wordSpacing: 0,
                                        letterSpacing: 0,
                                        textIndent: 0,
                                        textRendering: "auto",
                                        textTransform: "none"
                                    }}
                                />
                                <div
                                    className="tt-menu navbar-search-suggestion ps"
                                    style={{
                                        position: "absolute",
                                        top: "100%",
                                        left: 0,
                                        zIndex: 100,
                                        display: "none"
                                    }}
                                >
                                    <div className="tt-dataset tt-dataset-pages" />
                                    <div className="tt-dataset tt-dataset-files" />
                                    <div className="tt-dataset tt-dataset-members" />
                                    <div className="ps__rail-x" style={{ left: 0, bottom: 0 }}>
                                        <div
                                            className="ps__thumb-x"
                                            tabIndex={0}
                                            style={{ left: 0, width: 0 }}
                                        />
                                    </div>
                                    <div className="ps__rail-y" style={{ top: 0, right: 0 }}>
                                        <div
                                            className="ps__thumb-y"
                                            tabIndex={0}
                                            style={{ top: 0, height: 0 }}
                                        />
                                    </div>
                                </div>
                            </span>
                            <i className="bx bx-x bx-md search-toggler cursor-pointer" />
                        </div>
                    </nav>
                    {/* / Navbar */}
                    {/* Content wrapper */}
                    <div className="content-wrapper">
                        {/* Content */}
                        <div className="container-xxl flex-grow-1 container-p-y">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-6 row-gap-4">
                                <div className="d-flex flex-column justify-content-center">
                                    <div className="mb-1">
                                        <span className="h5">Order #32543 </span>
                                        <span className="badge bg-label-success me-1 ms-2">Paid</span>{" "}
                                        <span className="badge bg-label-info">Ready to Pickup</span>
                                    </div>
                                    <p className="mb-0">
                                        Aug 17, <span id="orderYear">2024</span>, 5:48 (ET)
                                    </p>
                                </div>
                                <div className="d-flex align-content-center flex-wrap gap-2">
                                    <button className="btn btn-label-danger delete-order">
                                        Delete Order
                                    </button>
                                </div>
                            </div>
                            {/* Order Details Table */}
                            <div className="row">
                                <div className="col-12 col-lg-8">
                                    <div className="card mb-6">
                                        <div className="card-header d-flex justify-content-between align-items-center">
                                            <h5 className="card-title m-0">Order details</h5>
                                            <h6 className="m-0">
                                                <a href=" javascript:void(0)">Edit</a>
                                            </h6>
                                        </div>
                                        <div className="card-datatable table-responsive">
                                            <div
                                                id="DataTables_Table_0_wrapper"
                                                className="dataTables_wrapper dt-bootstrap5 no-footer"
                                            >
                                                <table
                                                    className="datatables-order-details table border-top dataTable no-footer dtr-column"
                                                    id="DataTables_Table_0"
                                                    style={{ width: 918 }}
                                                >
                                                    <thead>
                                                        <tr>
                                                            <th
                                                                className="control sorting_disabled dtr-hidden"
                                                                rowSpan={1}
                                                                colSpan={1}
                                                                style={{ width: 0, display: "none" }}
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
                                                                className="w-50 sorting_disabled"
                                                                rowSpan={1}
                                                                colSpan={1}
                                                                style={{ width: 359 }}
                                                                aria-label="products"
                                                                _mstaria-label={120744}
                                                            >
                                                                products
                                                            </th>
                                                            <th
                                                                className="w-25 sorting_disabled"
                                                                rowSpan={1}
                                                                colSpan={1}
                                                                style={{ width: 156 }}
                                                                aria-label="price"
                                                                _mstaria-label={61646}
                                                            >
                                                                price
                                                            </th>
                                                            <th
                                                                className="w-25 sorting_disabled"
                                                                rowSpan={1}
                                                                colSpan={1}
                                                                style={{ width: 147 }}
                                                                aria-label="qty"
                                                                _mstaria-label={36504}
                                                            >
                                                                qty
                                                            </th>
                                                            <th
                                                                className="sorting_disabled"
                                                                rowSpan={1}
                                                                colSpan={1}
                                                                style={{ width: 42 }}
                                                                aria-label="total"
                                                                _mstaria-label={63726}
                                                            >
                                                                total
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {orderDetails.orderItems && orderDetails.orderItems.length > 0 ? (
                                                            orderDetails.orderItems.map((item) => (
                                                                <tr className="odd" key={item.orderItemId}>
                                                                    <td className="control" tabIndex={0} style={{ display: "none" }} />
                                                                    <td className="dt-checkboxes-cell">
                                                                        <input type="checkbox" className="dt-checkboxes form-check-input" />
                                                                    </td>
                                                                    <td className="sorting_1">
                                                                        <div className="d-flex justify-content-start align-items-center text-nowrap">
                                                                            <div className="avatar-wrapper">
                                                                                <div className="avatar avatar-sm me-3">


                                                                                </div>
                                                                            </div>
                                                                            <div className="d-flex flex-column">
                                                                                {/* Hiển thị tên sản phẩm */}
                                                                                <h6 className="text-heading mb-0">
                                                                                    {item.variant.product ? item.variant.product.name : 'Product Name'}
                                                                                </h6>
                                                                                <small>
                                                                                    {item.variant && (
                                                                                        <>
                                                                                            {/* Hiển thị tên màu sắc */}
                                                                                            <span>Color: {item.variant.color ? item.variant.color.colorName : 'Color Name'}</span>
                                                                                            <span> & </span>
                                                                                            <span>Size: {item.variant.size ? item.variant.size.sizeName : 'Size Name'}</span>
                                                                                        </>
                                                                                    )}
                                                                                </small>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    {/* Hiển thị giá sản phẩm */}
                                                                    <td>
                                                                        <span>${item.price}</span>
                                                                    </td>
                                                                    {/* Hiển thị số lượng */}
                                                                    <td>
                                                                        <span>{item.quantity}</span>
                                                                    </td>
                                                                    {/* Hiển thị tổng giá tiền */}
                                                                    <td>
                                                                    <span className="text-body">${(item.price * item.quantity).toFixed(2)}</span>

                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="6">No order items available.</td>
                                                            </tr>
                                                        )}
                                                    </tbody>


                                                </table>
                                                <div style={{ width: "1%" }} />
                                            </div>
                                            <div className="d-flex justify-content-end align-items-center m-6 mb-2">
                                               
                                                        <div className="order-calculations">
                                                            <div className="d-flex justify-content-start">
                                                                <h6 className="w-px-100 mb-0">Total:</h6>
                                                                <h6 className="mb-0">${order.totalAmount}</h6>
                                                            </div>
                                                        </div>
                                                  
                                        
                                            </div>

                                        </div>
                                        {orderDetails.status === 'pending' && (
                                            <div style={{ display: "flex", justifyContent: 'center', margin: '15px' }}>
                                                <button onClick={handleConfirmOrder} className="btn btn-success">
                                                    Confirm Order
                                                </button>
                                                <button onClick={handleDenyOrder} className="btn btn-danger">
                                                    Deny Order
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {isConfirmed && (
                                        <div className="card mb-6">
                                            <div className="card-header">
                                                <h5 className="card-title m-0">Shipping activity</h5>
                                            </div>
                                            <div className="card-body pt-1">
                                                <ul className="timeline pb-0 mb-0">
                                                    <li className="timeline-item timeline-item-transparent border-primary">
                                                        <span className="timeline-point timeline-point-primary" />
                                                        <div className="timeline-event">
                                                            <div className="timeline-header">
                                                                <h6 className="mb-0">
                                                                    Order was placed (Order ID: #{order.orderId})
                                                                </h6>
                                                                <small className="text-muted">Confirmed at:{confirmationTime}</small>

                                                                {/* Nếu chưa được pick-up, hiển thị nút pick-up */}
                                                                {!isPickup && <small><button onClick={handlePickupOrder} className="btn btn-success">Confirm Pick-Up</button></small>}
                                                            </div>
                                                            <p className="mt-3">
                                                                Your order has been placed successfully
                                                            </p>
                                                        </div>
                                                    </li>

                                                    {/* Kiểm tra và hiển thị bước pick-up */}
                                                    {isPickup && (
                                                        <li className="timeline-item timeline-item-transparent border-primary">
                                                            <span className="timeline-point timeline-point-primary" />
                                                            <div className="timeline-event">
                                                                <div className="timeline-header">
                                                                    <h6 className="mb-0">Pick-up</h6>
                                                                    <small className="text-muted">{confirmationTime}</small>

                                                                    {/* Nếu chưa được dispatch, hiển thị nút dispatch */}
                                                                    {!isDispatch && <small><button onClick={handledispatchOrder} className="btn btn-success">Dispatch Order</button></small>}
                                                                </div>
                                                                <p className="mt-3 mb-3">Pick-up scheduled with courier</p>
                                                            </div>
                                                        </li>
                                                    )}

                                                    {/* Kiểm tra và hiển thị bước dispatch */}
                                                    {isDispatch && (
                                                        <li className="timeline-item timeline-item-transparent border-primary">
                                                            <span className="timeline-point timeline-point-primary" />
                                                            <div className="timeline-event">
                                                                <div className="timeline-header">
                                                                    <h6 className="mb-0">Dispatched</h6>
                                                                    <small className="text-muted">{confirmationTime}</small>

                                                                    {/* Nếu chưa được arrived, hiển thị nút arrived */}
                                                                    {!isArrived && <small><button onClick={handleArriveOrder} className="btn btn-success">Arrive Order</button></small>}
                                                                </div>
                                                                <p className="mt-3 mb-3">
                                                                    Item has been picked up by courier
                                                                </p>
                                                            </div>
                                                        </li>
                                                    )}

                                                    {/* Kiểm tra và hiển thị bước arrived */}
                                                    {isArrived && (
                                                        <li className="timeline-item timeline-item-transparent border-primary">
                                                            <span className="timeline-point timeline-point-primary" />
                                                            <div className="timeline-event">
                                                                <div className="timeline-header">
                                                                    <h6 className="mb-0">Package Arrived</h6>
                                                                    <small className="text-muted">Arrived at destination</small>
                                                                </div>
                                                                <p className="mt-3 mb-3">
                                                                    Package has arrived at its destination.
                                                                </p>
                                                            </div>
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                </div>

                                {order ? (
                                    <div className="col-12 col-lg-4">
                                        <div className="card mb-6">
                                            <div className="card-header">
                                                <h5 className="card-title m-0">Customer details</h5>
                                            </div>
                                            <div className="card-body">
                                                <div className="d-flex justify-content-start align-items-center mb-6">
                                                    <div className="avatar me-3">
                                                    </div>
                                                    <div className="d-flex flex-column">
                                                        <a
                                                            href="app-user-view-account.html"
                                                            className="text-body text-nowrap"
                                                        >
                                                            <h6 className="mb-0">{order.name}</h6>
                                                        </a>
                                                        <span>{order.orderId}</span>
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-start align-items-center mb-6">
                                                    <span className="avatar rounded-circle bg-label-success me-3 d-flex align-items-center justify-content-center">
                                                        <i className="bx bx-cart bx-lg" />
                                                    </span>
                                                    <h6 className="text-nowrap mb-0"></h6>
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <h6 className="mb-1">Contact info</h6>
                                                    <h6 className="mb-1">
                                                        <a
                                                            href=" javascript:void(0)"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#editUser"
                                                        >
                                                            Edit
                                                        </a>
                                                    </h6>
                                                </div>
                                                <p className=" mb-1">Email:{order.email}</p>
                                                <p className=" mb-0">Mobile: +1 (609) {order.telephone}</p>
                                            </div>
                                        </div>
                                        <div className="card mb-6">
                                            <div className="card-header d-flex justify-content-between">
                                                <h5 className="card-title m-0">Shipping address</h5>
                                                <h6 className="m-0">
                                                    <a
                                                        href=" javascript:void(0)"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#addNewAddress"
                                                    >
                                                        Edit
                                                    </a>
                                                </h6>
                                            </div>
                                            <div className="card-body">
                                                <p className="mb-0">
                                                    {order.shippingAddress}<br />
                                                    Latheronwheel <br />
                                                    KW5 8NW,London <br />
                                                    UK
                                                </p>
                                            </div>
                                        </div>
                                        <div className="card mb-6">
                                            <div className="card-header d-flex justify-content-between pb-2">
                                                <h5 className="card-title m-0">Billing address</h5>
                                                <h6 className="m-0">
                                                    <a
                                                        href=" javascript:void(0)"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#addNewAddress"
                                                    >
                                                        Edit
                                                    </a>
                                                </h6>
                                            </div>
                                            <div className="card-body">
                                                <p className="mb-6">
                                                    {order.shippingAddress} <br />
                                                    Latheronwheel <br />
                                                    KW5 8NW,London <br />
                                                    UK
                                                </p>
                                                {/* <h5 className="mb-1">Mastercard</h5>
                                                <p className="mb-0">Card Number: ******4291</p> */}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p>No order details available.</p>
                                )}
                            </div>
                            {/* Edit User Modal */}
                            <div
                                className="modal fade"
                                id="editUser"
                                tabIndex={-1}
                                style={{ display: "none" }}
                                aria-hidden="true"
                            >
                                <div className="modal-dialog modal-lg modal-simple modal-edit-user">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <button
                                                type="button"
                                                className="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                                _mstaria-label={59709}
                                            />
                                            <div className="text-center mb-6">
                                                <h4 className="mb-2">Edit User Information</h4>
                                                <p>Updating user details will receive a privacy audit.</p>
                                            </div>
                                            <form className="row g-6" onsubmit="false">
                                                <div className="col-12 col-md-6">
                                                    <label
                                                        className="form-label"
                                                        htmlFor="modalEditUserFirstName"
                                                    >
                                                        First Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="modalEditUserFirstName"
                                                        name="modalEditUserFirstName"
                                                        className="form-control"
                                                        placeholder="John"
                                                        defaultValue="John"
                                                        _mstplaceholder={44746}
                                                    />
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <label className="form-label" htmlFor="modalEditUserLastName">
                                                        Last Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="modalEditUserLastName"
                                                        name="modalEditUserLastName"
                                                        className="form-control"
                                                        placeholder="Doe"
                                                        defaultValue="Doe"
                                                        _mstplaceholder={29549}
                                                    />
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label" htmlFor="modalEditUserName">
                                                        Username
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="modalEditUserName"
                                                        name="modalEditUserName"
                                                        className="form-control"
                                                        placeholder="johndoe007"
                                                        defaultValue="johndoe007"
                                                        _mstplaceholder={125879}
                                                    />
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <label className="form-label" htmlFor="modalEditUserEmail">
                                                        Email
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="modalEditUserEmail"
                                                        name="modalEditUserEmail"
                                                        className="form-control"
                                                        placeholder="example@domain.com"
                                                        defaultValue="example@domain.com"
                                                        _mstplaceholder={360750}
                                                    />
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <label className="form-label" htmlFor="modalEditUserStatus">
                                                        Status
                                                    </label>
                                                    <div className="position-relative">
                                                        <div className="position-relative">
                                                            <select
                                                                id="modalEditUserStatus"
                                                                name="modalEditUserStatus"
                                                                className="select2 form-select select2-hidden-accessible"
                                                                aria-label="Default select example"
                                                                tabIndex={-1}
                                                                aria-hidden="true"
                                                                data-select2-id="modalEditUserStatus"
                                                                _mstaria-label={455182}
                                                            >
                                                                <option selected="" data-select2-id={15}>
                                                                    Status
                                                                </option>
                                                                <option value={1}>Active</option>
                                                                <option value={2}>Inactive</option>
                                                                <option value={3}>Suspended</option>
                                                            </select>
                                                            <span
                                                                className="select2 select2-container select2-container--default"
                                                                dir="ltr"
                                                                data-select2-id={14}
                                                                style={{ width: "auto" }}
                                                            >
                                                                <span className="selection">
                                                                    <span
                                                                        className="select2-selection select2-selection--single"
                                                                        role="combobox"
                                                                        aria-haspopup="true"
                                                                        aria-expanded="false"
                                                                        tabIndex={0}
                                                                        aria-disabled="false"
                                                                        aria-labelledby="select2-modalEditUserStatus-container"
                                                                    >
                                                                        <span
                                                                            className="select2-selection__rendered"
                                                                            id="select2-modalEditUserStatus-container"
                                                                            role="textbox"
                                                                            aria-readonly="true"
                                                                            title="Status"
                                                                        >
                                                                            Status
                                                                        </span>
                                                                        <span
                                                                            className="select2-selection__arrow"
                                                                            role="presentation"
                                                                        >
                                                                            <b role="presentation" />
                                                                        </span>
                                                                    </span>
                                                                </span>
                                                                <span className="dropdown-wrapper" aria-hidden="true" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <label className="form-label" htmlFor="modalEditTaxID">
                                                        Tax ID
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="modalEditTaxID"
                                                        name="modalEditTaxID"
                                                        className="form-control modal-edit-tax-id"
                                                        placeholder="123 456 7890"
                                                        defaultValue="123 456 7890"
                                                        _mstplaceholder={78975}
                                                    />
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <label className="form-label" htmlFor="modalEditUserPhone">
                                                        Phone Number
                                                    </label>
                                                    <div className="input-group">
                                                        <span className="input-group-text">US (+1)</span>
                                                        <input
                                                            type="text"
                                                            id="modalEditUserPhone"
                                                            name="modalEditUserPhone"
                                                            className="form-control phone-number-mask"
                                                            placeholder="202 555 0111"
                                                            defaultValue="202 555 0111"
                                                            _mstplaceholder={74906}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <label className="form-label" htmlFor="modalEditUserLanguage">
                                                        Language
                                                    </label>
                                                    <div className="position-relative">
                                                        <div className="position-relative">
                                                            <select
                                                                id="modalEditUserLanguage"
                                                                name="modalEditUserLanguage"
                                                                className="select2 form-select select2-hidden-accessible"
                                                                multiple=""
                                                                tabIndex={-1}
                                                                aria-hidden="true"
                                                                data-select2-id="modalEditUserLanguage"
                                                            >
                                                                <option value="">Select</option>
                                                                <option
                                                                    value="english"
                                                                    selected=""
                                                                    data-select2-id={26}
                                                                >
                                                                    English
                                                                </option>
                                                                <option value="spanish">Spanish</option>
                                                                <option value="french">French</option>
                                                                <option value="german">German</option>
                                                                <option value="dutch">Dutch</option>
                                                                <option value="hebrew">Hebrew</option>
                                                                <option value="sanskrit">Sanskrit</option>
                                                                <option value="hindi">Hindi</option>
                                                            </select>
                                                            <span
                                                                className="select2 select2-container select2-container--default"
                                                                dir="ltr"
                                                                data-select2-id={25}
                                                                style={{ width: "auto" }}
                                                            >
                                                                <span className="selection">
                                                                    <span
                                                                        className="select2-selection select2-selection--multiple"
                                                                        role="combobox"
                                                                        aria-haspopup="true"
                                                                        aria-expanded="false"
                                                                        tabIndex={-1}
                                                                        aria-disabled="false"
                                                                    >
                                                                        <ul className="select2-selection__rendered">
                                                                            <li
                                                                                className="select2-selection__choice"
                                                                                title="English"
                                                                                data-select2-id={27}
                                                                            >
                                                                                <span
                                                                                    className="select2-selection__choice__remove"
                                                                                    role="presentation"
                                                                                >
                                                                                    ×
                                                                                </span>
                                                                                <font _mstmutation={1}>English</font>
                                                                            </li>
                                                                            <li className="select2-search select2-search--inline">
                                                                                <input
                                                                                    className="select2-search__field"
                                                                                    type="search"
                                                                                    tabIndex={0}
                                                                                    autoComplete="off"
                                                                                    autoCorrect="off"
                                                                                    autoCapitalize="none"
                                                                                    spellCheck="false"
                                                                                    role="searchbox"
                                                                                    aria-autocomplete="list"
                                                                                    placeholder=""
                                                                                    style={{ width: "0.75em" }}
                                                                                />
                                                                            </li>
                                                                        </ul>
                                                                    </span>
                                                                </span>
                                                                <span className="dropdown-wrapper" aria-hidden="true" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <label className="form-label" htmlFor="modalEditUserCountry">
                                                        Country
                                                    </label>
                                                    <div className="position-relative">
                                                        <div className="position-relative">
                                                            <select
                                                                id="modalEditUserCountry"
                                                                name="modalEditUserCountry"
                                                                className="select2 form-select select2-hidden-accessible"
                                                                data-allow-clear="true"
                                                                tabIndex={-1}
                                                                aria-hidden="true"
                                                                data-select2-id="modalEditUserCountry"
                                                            >
                                                                <option value="">Select</option>
                                                                <option value="Australia">Australia</option>
                                                                <option value="Bangladesh">Bangladesh</option>
                                                                <option value="Belarus">Belarus</option>
                                                                <option value="Brazil">Brazil</option>
                                                                <option value="Canada">Canada</option>
                                                                <option value="China">China</option>
                                                                <option value="France">France</option>
                                                                <option value="Germany">Germany</option>
                                                                <option value="India" selected="" data-select2-id={54}>
                                                                    India
                                                                </option>
                                                                <option value="Indonesia">Indonesia</option>
                                                                <option value="Israel">Israel</option>
                                                                <option value="Italy">Italy</option>
                                                                <option value="Japan">Japan</option>
                                                                <option value="Korea">Korea, Republic of</option>
                                                                <option value="Mexico">Mexico</option>
                                                                <option value="Philippines">Philippines</option>
                                                                <option value="Russia">Russian Federation</option>
                                                                <option value="South Africa">South Africa</option>
                                                                <option value="Thailand">Thailand</option>
                                                                <option value="Turkey">Turkey</option>
                                                                <option value="Ukraine">Ukraine</option>
                                                                <option value="United Arab Emirates">
                                                                    United Arab Emirates
                                                                </option>
                                                                <option value="United Kingdom">United Kingdom</option>
                                                                <option value="United States">United States</option>
                                                            </select>
                                                            <span
                                                                className="select2 select2-container select2-container--default"
                                                                dir="ltr"
                                                                data-select2-id={53}
                                                                style={{ width: "auto" }}
                                                            >
                                                                <span className="selection">
                                                                    <span
                                                                        className="select2-selection select2-selection--single"
                                                                        role="combobox"
                                                                        aria-haspopup="true"
                                                                        aria-expanded="false"
                                                                        tabIndex={0}
                                                                        aria-disabled="false"
                                                                        aria-labelledby="select2-modalEditUserCountry-container"
                                                                    >
                                                                        <span
                                                                            className="select2-selection__rendered"
                                                                            id="select2-modalEditUserCountry-container"
                                                                            role="textbox"
                                                                            aria-readonly="true"
                                                                            title="India"
                                                                        >
                                                                            <span
                                                                                className="select2-selection__clear"
                                                                                title="Remove all items"
                                                                                data-select2-id={55}
                                                                            >
                                                                                ×
                                                                            </span>
                                                                            <font _mstmutation={1}>India</font>
                                                                        </span>
                                                                        <span
                                                                            className="select2-selection__arrow"
                                                                            role="presentation"
                                                                        >
                                                                            <b role="presentation" />
                                                                        </span>
                                                                    </span>
                                                                </span>
                                                                <span className="dropdown-wrapper" aria-hidden="true" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="form-check form-switch my-2 ms-2">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            id="editBillingAddress"
                                                            defaultChecked=""
                                                        />
                                                        <label
                                                            htmlFor="editBillingAddress"
                                                            className="switch-label"
                                                        >
                                                            Use as a billing address?
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col-12 text-center">
                                                    <button type="submit" className="btn btn-primary me-3">
                                                        Submit
                                                    </button>
                                                    <button
                                                        type="reset"
                                                        className="btn btn-label-secondary"
                                                        data-bs-dismiss="modal"
                                                        aria-label="Close"
                                                        _mstaria-label={59709}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*/ Edit User Modal */}
                            {/* Add New Address Modal */}
                            <div
                                className="modal fade"
                                id="addNewAddress"
                                tabIndex={-1}
                                style={{ display: "none" }}
                                aria-hidden="true"
                            >
                                <div className="modal-dialog modal-lg modal-simple modal-add-new-address">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <button
                                                type="button"
                                                className="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                                _mstaria-label={59709}
                                            />
                                            <div className="text-center mb-6">
                                                <h4 className="address-title mb-2">Add New Address</h4>
                                                <p className="address-subtitle">
                                                    Add new address for express delivery
                                                </p>
                                            </div>
                                            <form
                                                id="addNewAddressForm"
                                                className="row g-6 fv-plugins-bootstrap5 fv-plugins-framework"
                                                onsubmit="return false"
                                                noValidate="novalidate"
                                            >
                                                <div className="col-12">
                                                    <div className="row">
                                                        <div className="col-md mb-md-0 mb-4">
                                                            <div className="form-check custom-option custom-option-icon checked">
                                                                <label
                                                                    className="form-check-label custom-option-content"
                                                                    htmlFor="customRadioHome"
                                                                >
                                                                    <span className="custom-option-body">
                                                                        <i className="bx bx-home" />
                                                                        <span className="custom-option-title">Home</span>
                                                                        <small> Delivery time (9am – 9pm) </small>
                                                                    </span>
                                                                    <input
                                                                        name="customRadioIcon"
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        defaultValue=""
                                                                        id="customRadioHome"
                                                                        defaultChecked=""
                                                                    />
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md mb-md-0 mb-4">
                                                            <div className="form-check custom-option custom-option-icon">
                                                                <label
                                                                    className="form-check-label custom-option-content"
                                                                    htmlFor="customRadioOffice"
                                                                >
                                                                    <span className="custom-option-body">
                                                                        <i className="bx bx-briefcase" />
                                                                        <span className="custom-option-title">
                                                                            {" "}
                                                                            Office{" "}
                                                                        </span>
                                                                        <small> Delivery time (9am – 5pm) </small>
                                                                    </span>
                                                                    <input
                                                                        name="customRadioIcon"
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        defaultValue=""
                                                                        id="customRadioOffice"
                                                                    />
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6 fv-plugins-icon-container">
                                                    <label className="form-label" htmlFor="modalAddressFirstName">
                                                        First Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="modalAddressFirstName"
                                                        name="modalAddressFirstName"
                                                        className="form-control"
                                                        placeholder="John"
                                                        _mstplaceholder={44746}
                                                    />
                                                    <div className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback" />
                                                </div>
                                                <div className="col-12 col-md-6 fv-plugins-icon-container">
                                                    <label className="form-label" htmlFor="modalAddressLastName">
                                                        Last Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="modalAddressLastName"
                                                        name="modalAddressLastName"
                                                        className="form-control"
                                                        placeholder="Doe"
                                                        _mstplaceholder={29549}
                                                    />
                                                    <div className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback" />
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label" htmlFor="modalAddressCountry">
                                                        Country
                                                    </label>
                                                    <div className="position-relative">
                                                        <div className="position-relative">
                                                            <select
                                                                id="modalAddressCountry"
                                                                name="modalAddressCountry"
                                                                className="select2 form-select select2-hidden-accessible"
                                                                data-allow-clear="true"
                                                                tabIndex={-1}
                                                                aria-hidden="true"
                                                                data-select2-id="modalAddressCountry"
                                                            >
                                                                <option value="" data-select2-id={82}>
                                                                    Select
                                                                </option>
                                                                <option value="Australia">Australia</option>
                                                                <option value="Bangladesh">Bangladesh</option>
                                                                <option value="Belarus">Belarus</option>
                                                                <option value="Brazil">Brazil</option>
                                                                <option value="Canada">Canada</option>
                                                                <option value="China">China</option>
                                                                <option value="France">France</option>
                                                                <option value="Germany">Germany</option>
                                                                <option value="India">India</option>
                                                                <option value="Indonesia">Indonesia</option>
                                                                <option value="Israel">Israel</option>
                                                                <option value="Italy">Italy</option>
                                                                <option value="Japan">Japan</option>
                                                                <option value="Korea">Korea, Republic of</option>
                                                                <option value="Mexico">Mexico</option>
                                                                <option value="Philippines">Philippines</option>
                                                                <option value="Russia">Russian Federation</option>
                                                                <option value="South Africa">South Africa</option>
                                                                <option value="Thailand">Thailand</option>
                                                                <option value="Turkey">Turkey</option>
                                                                <option value="Ukraine">Ukraine</option>
                                                                <option value="United Arab Emirates">
                                                                    United Arab Emirates
                                                                </option>
                                                                <option value="United Kingdom">United Kingdom</option>
                                                                <option value="United States">United States</option>
                                                            </select>
                                                            <span
                                                                className="select2 select2-container select2-container--default"
                                                                dir="ltr"
                                                                data-select2-id={81}
                                                                style={{ width: "auto" }}
                                                            >
                                                                <span className="selection">
                                                                    <span
                                                                        className="select2-selection select2-selection--single"
                                                                        role="combobox"
                                                                        aria-haspopup="true"
                                                                        aria-expanded="false"
                                                                        tabIndex={0}
                                                                        aria-disabled="false"
                                                                        aria-labelledby="select2-modalAddressCountry-container"
                                                                    >
                                                                        <span
                                                                            className="select2-selection__rendered"
                                                                            id="select2-modalAddressCountry-container"
                                                                            role="textbox"
                                                                            aria-readonly="true"
                                                                        >
                                                                            <span className="select2-selection__placeholder">
                                                                                Select value
                                                                            </span>
                                                                        </span>
                                                                        <span
                                                                            className="select2-selection__arrow"
                                                                            role="presentation"
                                                                        >
                                                                            <b role="presentation" />
                                                                        </span>
                                                                    </span>
                                                                </span>
                                                                <span className="dropdown-wrapper" aria-hidden="true" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 ">
                                                    <label className="form-label" htmlFor="modalAddressAddress1">
                                                        Address Line 1
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="modalAddressAddress1"
                                                        name="modalAddressAddress1"
                                                        className="form-control"
                                                        placeholder="12, Business Park"
                                                        _mstplaceholder={266383}
                                                    />
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label" htmlFor="modalAddressAddress2">
                                                        Address Line 2
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="modalAddressAddress2"
                                                        name="modalAddressAddress2"
                                                        className="form-control"
                                                        placeholder="Mall Road"
                                                        _mstplaceholder={107406}
                                                    />
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <label className="form-label" htmlFor="modalAddressLandmark">
                                                        Landmark
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="modalAddressLandmark"
                                                        name="modalAddressLandmark"
                                                        className="form-control"
                                                        placeholder="Nr. Hard Rock Cafe"
                                                        _mstplaceholder={256789}
                                                    />
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <label className="form-label" htmlFor="modalAddressCity">
                                                        City
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="modalAddressCity"
                                                        name="modalAddressCity"
                                                        className="form-control"
                                                        placeholder="Los Angeles"
                                                        _mstplaceholder={152503}
                                                    />
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <label className="form-label" htmlFor="modalAddressLandmark">
                                                        State
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="modalAddressState"
                                                        name="modalAddressState"
                                                        className="form-control"
                                                        placeholder="California"
                                                        _mstplaceholder={154310}
                                                    />
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <label className="form-label" htmlFor="modalAddressZipCode">
                                                        Zip Code
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="modalAddressZipCode"
                                                        name="modalAddressZipCode"
                                                        className="form-control"
                                                        placeholder={99950}
                                                        _mstplaceholder={31538}
                                                    />
                                                </div>
                                                <div className="col-12">
                                                    <div className="form-check form-switch my-2 ms-2">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            id="billingAddress"
                                                        />
                                                        <label htmlFor="billingAddress" className="switch-label">
                                                            Use as a billing address?
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col-12 text-center">
                                                    <button type="submit" className="btn btn-primary me-3">
                                                        Submit
                                                    </button>
                                                    <button
                                                        type="reset"
                                                        className="btn btn-label-secondary"
                                                        data-bs-dismiss="modal"
                                                        aria-label="Close"
                                                        _mstaria-label={59709}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                                <input type="hidden" />
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*/ Add New Address Modal */}
                        </div>
                        {/* / Content */}
                        {/* Footer */}
                        <footer className="content-footer footer bg-footer-theme">
                            <div className="container-xxl">
                                <div className="footer-container d-flex align-items-center justify-content-between py-4 flex-md-row flex-column">
                                    <div className="text-body">
                                        © <font _mstmutation={1}>2024, made with ❤️ by </font>
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

export default Oderdetails