import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Navigate } from 'react-router-dom';


import Select from 'react-select';

const Addproduct = () => {
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

    const [brandName, setBrandName] = useState('');
    const [brandSlug, setBrandSlug] = useState('');
    const [brandImage, setBrandImage] = useState('');
    const [brandDescription, setBrandDescription] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [categorySlug, setCategorySlug] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [colorName, setColorName] = useState('');
    const [sizeName, setSizeName] = useState('');

    // Thêm mới Brand
    const handleAddBrand = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'https://projectky320240926105522.azurewebsites.net/api/Brand',
                {
                    name: brandName,
                    slug: brandSlug.toLowerCase().replace(/ /g, '-'),
                    image: brandImage, 
                    description: brandDescription,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
                
            );
            alert("thêm thành công")
            console.log('Brand added:', response.data);
            setBrandName('');
            setBrandSlug('');
            setBrandImage('');
            setBrandDescription('');
            
        } catch (error) {
            console.error('Error adding brand:', error);
        }
    };

    // Thêm mới Category
    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'https://projectky320240926105522.azurewebsites.net/api/Category',
                {
                    name: categoryName,
                    slug: categorySlug.toLowerCase().replace(/ /g, '-'),
                    description: categoryDescription,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Category added:', response.data);
            setCategoryName('');
            setCategorySlug('');
            setCategoryDescription('');
            
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    // Thêm mới Color
    const handleAddColor = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'https://projectky320240926105522.azurewebsites.net/api/Color',
                {
                    colorName: colorName,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Color added:', response.data);
            setColorName('');
        } catch (error) {
            console.error('Error adding color:', error);
        }
    };

    // Thêm mới Size
    const handleAddSize = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'https://projectky320240926105522.azurewebsites.net/api/Size',
                {
                    sizeName: sizeName,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Size added:', response.data);
            setSizeName('');
        } catch (error) {
            console.error('Error adding size:', error);
        }
    };

    ;

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

        // Xử lý lại khi kích thước cửa sổ thay đổi
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
        <div>
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
                                    <li className="menu-item ">
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
                                            <li className="menu-item active">
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
                                            <li className="menu-item active">
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
                                            <li className="menu-item">
                                                <a href="/Oderlist" className="menu-link">
                                                    <div className="text-truncate" data-i18n="Order List">
                                                        Order List
                                                    </div>
                                                </a>
                                            </li>
                                            <li className="menu-item">
                                                <a href="/Oderdetails" className="menu-link">
                                                    <div className="text-truncate" data-i18n="Order Details">
                                                        Order Details
                                                    </div>
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                    {/* <li className={`menu-item ${menuState.Customer ? 'open' : ''}`}>
                                        <a href="#" className="menu-link menu-toggle" onClick={(e) => { e.preventDefault(); handleMenuToggle('Customer'); }}>
                                            <div className="text-truncate" data-i18n="Customer">
                                                Customer
                                            </div>
                                        </a>
                                        <ul className="menu-sub">
                                            <li className="menu-item">
                                                <a href="/Customer" className="menu-link">
                                                    <div className="text-truncate" data-i18n="All Customers">
                                                        All Customers
                                                    </div>
                                                </a>
                                            </li>
                                            <li className="menu-item">
                                                <a href="javascript:void(0);" className="menu-link menu-toggle">
                                                    <div className="text-truncate" data-i18n="Customer Details">
                                                        Customer Details
                                                    </div>
                                                </a>
                                                <ul className="menu-sub">
                                                    <li className="menu-item">
                                                        <a
                                                            href="app-ecommerce-customer-details-overview.html"
                                                            className="menu-link"
                                                        >
                                                            <div className="text-truncate" data-i18n="Overview">
                                                                Overview
                                                            </div>
                                                        </a>
                                                    </li>
                                                    <li className="menu-item">
                                                        <a
                                                            href="app-ecommerce-customer-details-security.html"
                                                            className="menu-link"
                                                        >
                                                            <div className="text-truncate" data-i18n="Security">
                                                                Security
                                                            </div>
                                                        </a>
                                                    </li>
                                                    <li className="menu-item">
                                                        <a
                                                            href="app-ecommerce-customer-details-billing.html"
                                                            className="menu-link"
                                                        >
                                                            <div className="text-truncate" data-i18n="Address & Billing">
                                                                Address &amp; Billing
                                                            </div>
                                                        </a>
                                                    </li>
                                                    <li className="menu-item">
                                                        <a
                                                            href="app-ecommerce-customer-details-notifications.html"
                                                            className="menu-link"
                                                        >
                                                            <div className="text-truncate" data-i18n="Notifications">
                                                                Notifications
                                                            </div>
                                                        </a>
                                                    </li>
                                                </ul>
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

                                    <li className="menu-item">
                                        <a href="javascript:void(0);" className="menu-link menu-toggle">
                                            <div className="text-truncate" data-i18n="Settings">
                                                Settings
                                            </div>
                                        </a>

                                    </li> */}
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
                            <div className='container'>
                                    {/* Brand Modal */}
                                    <div className="modal fade" id="addBrandModal" tabIndex="-1" aria-labelledby="addBrandModalLabel" aria-hidden="true">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="addBrandModalLabel">Thêm Brand</h5>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    <form onSubmit={handleAddBrand}>
                                                        <div className="mb-3">
                                                            <label htmlFor="brandName" className="form-label">Tên Brand</label>
                                                            <input type="text" className="form-control" id="brandName" value={brandName} onChange={(e) => setBrandName(e.target.value)} required />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="brandSlug" className="form-label">Slug Brand</label>
                                                            <input type="text" className="form-control" id="brandSlug" value={brandSlug} onChange={(e) => setBrandSlug(e.target.value)} required />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="brandImage" className="form-label">URL Hình ảnh Brand</label>
                                                            <input type="text" className="form-control" id="brandImage" value={brandImage} onChange={(e) => setBrandImage(e.target.value)} required />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="brandDescription" className="form-label">Mô tả Brand</label>
                                                            <input type="text" className="form-control" id="brandDescription" value={brandDescription} onChange={(e) => setBrandDescription(e.target.value)} required />
                                                        </div>
                                                        <button type="submit" className="btn btn-primary">Thêm Brand</button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Category Modal */}
                                    <div className="modal fade" id="addCategoryModal" tabIndex="-1" aria-labelledby="addCategoryModalLabel" aria-hidden="true">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="addCategoryModalLabel">Thêm Category</h5>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    <form onSubmit={handleAddCategory}>
                                                        <div className="mb-3">
                                                            <label htmlFor="categoryName" className="form-label">Tên Category</label>
                                                            <input type="text" className="form-control" id="categoryName" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="categorySlug" className="form-label">Slug Category</label>
                                                            <input type="text" className="form-control" id="categorySlug" value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)} required />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="categoryDescription" className="form-label">Mô tả Category</label>
                                                            <input type="text" className="form-control" id="categoryDescription" value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} required />
                                                        </div>
                                                        <button type="submit" className="btn btn-primary">Thêm Category</button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Color Modal */}
                                    <div className="modal fade" id="addColorModal" tabIndex="-1" aria-labelledby="addColorModalLabel" aria-hidden="true">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="addColorModalLabel">Thêm Color</h5>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    <form onSubmit={handleAddColor}>
                                                        <div className="mb-3">
                                                            <label htmlFor="colorName" className="form-label">Tên Color</label>
                                                            <input type="text" className="form-control" id="colorName" value={colorName} onChange={(e) => setColorName(e.target.value)} required />
                                                        </div>
                                                        <button type="submit" className="btn btn-primary">Thêm Color</button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Size Modal */}
                                    <div className="modal fade" id="addSizeModal" tabIndex="-1" aria-labelledby="addSizeModalLabel" aria-hidden="true">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="addSizeModalLabel">Thêm Size</h5>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    <form onSubmit={handleAddSize}>
                                                        <div className="mb-3">
                                                            <label htmlFor="sizeName" className="form-label">Tên Size</label>
                                                            <input type="text" className="form-control" id="sizeName" value={sizeName} onChange={(e) => setSizeName(e.target.value)} required />
                                                        </div>
                                                        <button type="submit" className="btn btn-primary">Thêm Size</button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Trigger buttons */}
                                    <div className="d-flex justify-content-center gap-3">
                                        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addBrandModal">Thêm Brand</button>
                                        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addCategoryModal">Thêm Category</button>
                                        <button className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#addColorModal">Thêm Color</button>
                                        <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addSizeModal">Thêm Size</button>
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

export default Addproduct