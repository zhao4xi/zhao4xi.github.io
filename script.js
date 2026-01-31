// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    // 初始化Tab切换功能
    initTabs();
    
    // 初始化搜索功能
    initSearch();
    
    // 检查是否是详情页
    if (window.location.hash.startsWith('#crate=')) {
        const crateName = decodeURIComponent(window.location.hash.substring(7));
        updateHeaderTitle(crateName);
        showCrateDetail(crateName);
    } else {
        updateHeaderTitle('武器箱列表');
        showCrateList();
    }
});

// 初始化Tab切换功能
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const searchContainer = document.querySelector('.search-container');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            
            // 更新Tab按钮状态
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 切换内容
            if (tab === 'crates') {
                // 显示武器箱页面
                searchContainer.style.display = 'block';
                updateHeaderTitle('武器箱列表');
                showCrateList();
            } else if (tab === 'calculator') {
                // 显示计算合适的武器页面
                searchContainer.style.display = 'none';
                updateHeaderTitle('计算合适的武器');
                showCalculatorPage();
            }
        });
    });
}

// 显示计算合适的武器页面
function showCalculatorPage() {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;
    
    // 清空主内容
    mainElement.innerHTML = '';
    
    // 创建计算器页面内容
    const calculatorContainer = document.createElement('div');
    calculatorContainer.className = 'calculator-container';
    calculatorContainer.innerHTML = `
        <div class="calculator-section">
            <div class="calculator-form">
                <div class="weapon-crate-container">
                    <h3>目标箱子</h3>
                    <div class="form-group">
                            <label for="crate-input-1">箱子:</label>
                            <div class="searchable-select">
                                <input type="text" id="crate-input-1" placeholder="搜索武器箱..." class="search-input">
                                <button id="clear-crate-1" class="clear-search-btn" title="清空搜索">&times;</button>
                                <div id="crate-dropdown-1" class="search-dropdown"></div>
                            </div>
                        </div>
                    <div class="form-group">
                        <label for="quality-select-1">品质:</label>
                        <select id="quality-select-1">
                            <option value="">请选择武器箱</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="weapon-select-1">名称:</label>
                        <select id="weapon-select-1">
                            <option value="">请选择品质</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="wear-select-1">外观:</label>
                        <select id="wear-select-1">
                            <option value="">请选择武器</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="wear-value-1">磨损:</label>
                        <input type="number" id="wear-value-1" placeholder="请选择外观" step="0.01" min="0" max="1">
                    </div>
                </div>
                <div class="weapon-crate-container">
                    <h3>主料1</h3>
                    <div class="form-group">
                            <label for="crate-input-2">箱子:</label>
                            <div class="searchable-select">
                                <input type="text" id="crate-input-2" placeholder="搜索武器箱..." class="search-input" disabled>
                                <button id="clear-crate-2" class="clear-search-btn" title="清空搜索" disabled>&times;</button>
                                <div id="crate-dropdown-2" class="search-dropdown"></div>
                            </div>
                        </div>
                    <div class="form-group">
                        <label for="quality-select-2">品质:</label>
                        <select id="quality-select-2" disabled>
                            <option value="">请选择武器箱</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="weapon-select-2">名称:</label>
                        <select id="weapon-select-2">
                            <option value="">请选择品质</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="wear-select-2">外观:</label>
                        <select id="wear-select-2">
                            <option value="">请选择武器</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="wear-value-2">磨损:</label>
                        <input type="number" id="wear-value-2" placeholder="请选择外观" step="0.01" min="0" max="1">
                    </div>
                    <div class="form-group">
                        <label for="quantity-input-2">数量:</label>
                        <input type="number" id="quantity-input-2" placeholder="1-9" step="1" min="1" max="9" value="1">
                    </div>
                </div>
                <div class="weapon-crate-container">
                    <h3>辅料</h3>
                    <div class="form-group">
                            <label for="crate-input-3">箱子:</label>
                            <div class="searchable-select">
                                <input type="text" id="crate-input-3" placeholder="搜索武器箱..." class="search-input">
                                <button id="clear-crate-3" class="clear-search-btn" title="清空搜索">&times;</button>
                                <div id="crate-dropdown-3" class="search-dropdown"></div>
                            </div>
                        </div>
                    <div class="form-group">
                        <label for="quality-select-3">品质:</label>
                        <select id="quality-select-3">
                            <option value="">请选择武器箱</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="material-input">材料:</label>
                        <textarea id="material-input" placeholder="材料内容" disabled rows="8"></textarea>
                    </div>
                </div>
                <button id="calculate-btn">计算</button>
            </div>
            <div id="calculator-results" class="calculator-results"></div>
        </div>
    `;
    
    mainElement.appendChild(calculatorContainer);
    
    // 初始化武器箱搜索功能
    initCrateSearch();
    
    // 添加计算按钮点击事件
    const calculateBtn = document.getElementById('calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            calculateSuitableWeapons();
        });
    }
}

// 初始化武器箱搜索功能
    function initCrateSearch() {
        // 初始化第一个武器箱
        initCrateInput('crate-input-1', 'crate-dropdown-1', 'quality-select-1', 'weapon-select-1', 'wear-select-1', 'wear-value-1', 'clear-crate-1', 'crate-input-2');
        // 初始化第二个武器箱（主料1）
        initCrateInput('crate-input-2', 'crate-dropdown-2', 'quality-select-2', 'weapon-select-2', 'wear-select-2', 'wear-value-2', 'clear-crate-2', null);
        // 初始化第三个武器箱（辅料）
        initCrateInput('crate-input-3', 'crate-dropdown-3', 'quality-select-3', null, null, null, 'clear-crate-3', null);
    }

// 初始化单个武器箱输入
function initCrateInput(inputId, dropdownId, qualityId, weaponId, wearId, wearValueId, clearId, linkedInputId) {
    const crateInput = document.getElementById(inputId);
    const crateDropdown = document.getElementById(dropdownId);
    const qualitySelect = document.getElementById(qualityId);
    const weaponSelect = document.getElementById(weaponId);
    const wearSelect = document.getElementById(wearId);
    const wearValueInput = document.getElementById(wearValueId);
    const linkedInput = linkedInputId ? document.getElementById(linkedInputId) : null;
    
    if (!crateInput || !crateDropdown || !qualitySelect) return;
    
    let highlightedIndex = -1;
    let dropdownItems = [];
    
    // 获取所有武器箱名称
    const crateNames = Object.keys(crateDatabase);
    
    // 品质中文映射
    const qualityMap = {
        covert: '隐秘',
        classified: '保密',
        restricted: '受限',
        milspec: '军规级',
        ancient: '远古',
        industrial: '工业级',
        consumer: '消费级'
    };
    
    // 品质等级顺序（从低到高）
    const qualityLevels = ['consumer', 'industrial', 'milspec', 'restricted', 'classified', 'covert', 'ancient'];
    
    // 显示搜索下拉列表
    function showDropdown(suggestions) {
        crateDropdown.innerHTML = '';
        dropdownItems = [];
        highlightedIndex = -1;
        
        suggestions.forEach(item => {
            const dropdownItem = document.createElement('div');
            dropdownItem.className = 'search-dropdown-item';
            dropdownItem.textContent = item;
            dropdownItem.addEventListener('click', function() {
                crateInput.value = item;
                if (linkedInput && linkedInputId !== 'crate-input-3') {
                    // 启用联动输入框，设置值后再禁用
                    linkedInput.disabled = false;
                    linkedInput.value = item;
                    linkedInput.disabled = true;
                    
                    // 找到联动输入框对应的清空按钮并禁用
                    const linkedClearId = linkedInputId.replace('crate-input', 'clear-crate');
                    const linkedClearBtn = document.getElementById(linkedClearId);
                    if (linkedClearBtn) {
                        linkedClearBtn.disabled = true;
                    }
                    
                    // 找到联动输入框对应的品质选择
                    const linkedQualityId = linkedInputId.replace('crate-input', 'quality-select');
                    const linkedQualitySelect = document.getElementById(linkedQualityId);
                    if (linkedQualitySelect) {
                        // 清空联动输入框对应的品质选择
                        linkedQualitySelect.innerHTML = '<option value="">请选择武器箱</option>';
                        // 从crateDatabase中获取武器箱对应的品质
                        const crateData = crateDatabase[item];
                        if (crateData) { 
                            for (const quality in crateData) {
                                if (crateData.hasOwnProperty(quality) && Array.isArray(crateData[quality]) && crateData[quality].length > 0) {
                                    // 如果是主料1的品质选择，暂时不添加任何选项
                                    // 品质会在目标箱子的品质选择变化时自动设置
                                    if (linkedInputId === 'crate-input-2') {
                                        continue;
                                    }
                                    const option = document.createElement('option');
                                    option.value = quality;
                                    option.textContent = qualityMap[quality] || quality;
                                    // 禁用最低品质（消费级）
                                    if (quality === 'consumer') {
                                        option.disabled = true;
                                    }
                                    linkedQualitySelect.appendChild(option);
                                }
                            }
                        }
                        // 清空联动输入框对应的武器选择和外观选择
                        const linkedWeaponId = linkedInputId.replace('crate-input', 'weapon-select');
                        const linkedWeaponSelect = document.getElementById(linkedWeaponId);
                        if (linkedWeaponSelect) {
                            linkedWeaponSelect.innerHTML = '<option value="">请选择品质</option>';
                        }
                        const linkedWearId = linkedInputId.replace('crate-input', 'wear-select');
                        const linkedWearSelect = document.getElementById(linkedWearId);
                        if (linkedWearSelect) {
                            linkedWearSelect.innerHTML = '<option value="">请选择武器</option>';
                        }
                        const linkedWearValueId = linkedInputId.replace('crate-input', 'wear-value');
                        const linkedWearValueInput = document.getElementById(linkedWearValueId);
                        if (linkedWearValueInput) {
                            linkedWearValueInput.value = '';
                            linkedWearValueInput.placeholder = '请选择外观';
                            linkedWearValueInput.min = 0;
                            linkedWearValueInput.max = 1;
                        }
                    }
                }
                updateQualitySelect(item, inputId);
                hideDropdown();
            });
            crateDropdown.appendChild(dropdownItem);
            dropdownItems.push(dropdownItem);
        });
        
        if (dropdownItems.length > 0) {
            crateDropdown.classList.add('show');
        } else {
            hideDropdown();
        }
    }
    
    // 隐藏搜索下拉列表
    function hideDropdown() {
        crateDropdown.classList.remove('show');
        highlightedIndex = -1;
        dropdownItems.forEach(item => item.classList.remove('highlight'));
    }
    
    // 高亮下拉列表项
    function highlightItem(index) {
        dropdownItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('highlight');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('highlight');
            }
        });
    }
    
    // 获取自动补全建议
    function getSuggestions(query) {
        const suggestions = [];
        const mainQualitySelect = document.getElementById('quality-select-2');
        const mainQuality = mainQualitySelect ? mainQualitySelect.value : null;
        
        const lowerQuery = query.toLowerCase();
        
        for (const crateName of crateNames) {
            // 如果是辅料的武器箱输入框，并且主料品质已选择，只显示包含该品质数据的武器箱
            if (inputId === 'crate-input-3' && mainQuality) {
                const crateData = crateDatabase[crateName];
                if (crateData && crateData[mainQuality] && crateData[mainQuality].length > 0) {
                    if (!query || crateName.toLowerCase().includes(lowerQuery)) {
                        suggestions.push(crateName);
                        if (suggestions.length >= 10) break;
                    }
                }
            } else {
                // 其他情况，显示所有匹配的武器箱
                if (!query || crateName.toLowerCase().includes(lowerQuery)) {
                    suggestions.push(crateName);
                    if (suggestions.length >= 10) break;
                }
            }
        }
        
        return suggestions;
    }
    
    // 更新品质选择
    function updateQualitySelect(crateName, inputId) {
        qualitySelect.innerHTML = '<option value="">请选择品质</option>';
        if (weaponSelect) {
            weaponSelect.innerHTML = '<option value="">请选择品质</option>';
        }
        if (wearSelect) {
            wearSelect.innerHTML = '<option value="">请选择武器</option>';
        }
        if (wearValueInput) {
            wearValueInput.value = '';
            wearValueInput.placeholder = '请选择外观';
            wearValueInput.min = 0;
            wearValueInput.max = 1;
        }
        
        const crateData = crateDatabase[crateName];
        if (!crateData) return;
        let index = 1;
        let firstQuality = null;
        for (const quality in crateData) {
            if (crateData.hasOwnProperty(quality) && Array.isArray(crateData[quality]) && crateData[quality].length > 0) {
                const option = document.createElement('option');
                option.value = quality;
                option.textContent = qualityMap[quality] || quality;
                
                // 禁用等级最低的物品品质（消费级）
                if (inputId=='crate-input-1' && index === 1) {
                   option.disabled = true;
                } else if (!firstQuality) {
                    // 记录第一个可用的品质
                    firstQuality = quality; 
                }
                index++;
                qualitySelect.appendChild(option);
            }
        }
        
        // 自动选择第一个可用的品质
        if (firstQuality) {
            qualitySelect.value = firstQuality;
            // 只有当武器选择框存在时才调用updateWeaponSelect
            if (weaponSelect) {
                updateWeaponSelect(crateName, firstQuality);
            }
        }
        
        // 如果是目标箱子的品质选择更新，同时更新主料1的品质选择
        if (inputId === 'crate-input-1') {
            const targetQualitySelect = document.getElementById('quality-select-1');
            if (targetQualitySelect && targetQualitySelect.value) {
                const mainQualitySelect = document.getElementById('quality-select-2');
                if (mainQualitySelect) {
                    const quality = targetQualitySelect.value;
                    // 找到当前品质在等级顺序中的索引
                    const qualityIndex = qualityLevels.indexOf(quality);
                    if (qualityIndex > 0) {
                        // 直接赋值主料1的品质为比当前品质低一级的选项
                        const lowerQuality = qualityLevels[qualityIndex - 1];
                        // 清空主料1的品质选择并直接赋值
                        mainQualitySelect.innerHTML = '';
                        const option = document.createElement('option');
                        option.value = lowerQuality;
                        option.textContent = qualityMap[lowerQuality] || lowerQuality;
                        option.selected = true;
                        mainQualitySelect.appendChild(option);
                        // 禁用主料1的品质选择
                        mainQualitySelect.disabled = true;
                        
                        // 更新主料1的武器箱名称为与目标武器箱相同的武器箱名称
                        const mainCrateInput = document.getElementById('crate-input-2');
                        if (mainCrateInput) {
                            // 启用主料1的武器箱输入框，设置值后再禁用
                            mainCrateInput.disabled = false;
                            mainCrateInput.value = crateName;
                            mainCrateInput.disabled = true;
                            
                            // 找到主料1的清空按钮并禁用
                            const mainClearBtn = document.getElementById('clear-crate-2');
                            if (mainClearBtn) {
                                mainClearBtn.disabled = true;
                            }
                            
                            // 更新主料1的武器选择
                            const mainCrateName = mainCrateInput.value;
                            if (mainCrateName) {
                                const mainWeaponSelect = document.getElementById('weapon-select-2');
                                if (mainWeaponSelect) {
                                    mainWeaponSelect.innerHTML = '<option value="">请选择武器</option>';
                                    const mainCrateData = crateDatabase[mainCrateName];
                                    if (mainCrateData && mainCrateData[lowerQuality]) {
                                        for (const weapon of mainCrateData[lowerQuality]) {
                                            const weaponOption = document.createElement('option');
                                            weaponOption.value = weapon;
                                            weaponOption.textContent = weapon;
                                            mainWeaponSelect.appendChild(weaponOption);
                                        }
                                        // 自动选择主料1的第一个可用武器
                                        if (mainCrateData[lowerQuality].length > 0) {
                                            mainWeaponSelect.value = mainCrateData[lowerQuality][0];
                                            
                                            // 触发武器选择变化事件，更新外观选择
                                            const mainWearSelect = document.getElementById('wear-select-2');
                                            if (mainWearSelect) {
                                                mainWearSelect.innerHTML = '<option value="">请选择武器</option>';
                                                
                                                const selectedWeapon = mainCrateData[lowerQuality][0];
                                                // 从itemCategory中获取该武器的外观分类
                                                if (itemCategory[selectedWeapon]) {
                                                    for (const wearCategory of itemCategory[selectedWeapon]) {
                                                        const wearOption = document.createElement('option');
                                                        wearOption.value = wearCategory.WearCategory;
                                                        wearOption.textContent = wearCategory.WearCategory;
                                                        mainWearSelect.appendChild(wearOption);
                                                    }
                                                    // 自动选择第一个外观分类
                                                    if (itemCategory[selectedWeapon].length > 0) {
                                                        mainWearSelect.value = itemCategory[selectedWeapon][0].WearCategory;
                                                        
                                                        // 更新磨损输入框的范围
                                                        const mainWearValueInput = document.getElementById('wear-value-2');
                                                        if (mainWearValueInput) {
                                                            const firstWear = itemCategory[selectedWeapon][0];
                                                            mainWearValueInput.min = firstWear.Min;
                                                            mainWearValueInput.max = firstWear.Max;
                                                            mainWearValueInput.placeholder = `(${firstWear.Min}-${firstWear.Max})`;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    
                    // 只有在没有自动设置外观选择时才清空
                    const mainWearSelect = document.getElementById('wear-select-2');
                    if (mainWearSelect && mainWearSelect.options.length <= 1) {
                        mainWearSelect.innerHTML = '<option value="">请选择武器</option>';
                    }
                    const mainWearValueInput = document.getElementById('wear-value-2');
                    if (mainWearValueInput && mainWearValueInput.placeholder === '请选择外观') {
                        mainWearValueInput.value = '';
                        mainWearValueInput.placeholder = '请选择外观';
                        mainWearValueInput.min = 0;
                        mainWearValueInput.max = 1;
                    }
                }
            }
        }
        
        // 如果是目标箱子或主料1的武器箱变化，同时更新辅料的武器箱
        if (inputId === 'crate-input-2' || inputId === 'crate-input-1') {
            const mainCrateInput = document.getElementById('crate-input-2');
            
            if (mainCrateInput && mainCrateInput.value) {
                // 更新辅料的武器箱
                const auxiliaryCrateInput = document.getElementById('crate-input-3');
                if (auxiliaryCrateInput) {
                    // 设置辅料的武器箱输入框值为主料1的武器箱值，但不禁用
                    auxiliaryCrateInput.value = mainCrateInput.value;
                    
                    // 找到辅料的清空按钮并启用
                    const auxiliaryClearBtn = document.getElementById('clear-crate-3');
                    if (auxiliaryClearBtn) {
                        auxiliaryClearBtn.disabled = false;
                    }
                    
                    // 更新辅料的品质选择
                    const auxiliaryQualitySelect = document.getElementById('quality-select-3');
                    const mainQualitySelect = document.getElementById('quality-select-2');
                    if (auxiliaryQualitySelect && mainQualitySelect && mainQualitySelect.value) {
                        // 清空辅料的品质选择
                        auxiliaryQualitySelect.innerHTML = '';
                        // 创建与主料品质相同的选项
                        const option = document.createElement('option');
                        option.value = mainQualitySelect.value;
                        option.textContent = qualityMap[mainQualitySelect.value] || mainQualitySelect.value;
                        option.selected = true;
                        auxiliaryQualitySelect.appendChild(option);
                        // 禁用辅料的品质选择
                        auxiliaryQualitySelect.disabled = true;
                    }
                }
            }
        }
        
        // 如果是辅料的武器箱变化，只更新辅料的品质选择，不影响其他输入框
        if (inputId === 'crate-input-3') {
            const auxiliaryQualitySelect = document.getElementById('quality-select-3');
            const mainQualitySelect = document.getElementById('quality-select-2');
            if (auxiliaryQualitySelect && mainQualitySelect && mainQualitySelect.value) {
                // 清空辅料的品质选择
                auxiliaryQualitySelect.innerHTML = '';
                // 创建与主料品质相同的选项
                const option = document.createElement('option');
                option.value = mainQualitySelect.value;
                option.textContent = qualityMap[mainQualitySelect.value] || mainQualitySelect.value;
                option.selected = true;
                auxiliaryQualitySelect.appendChild(option);
                // 禁用辅料的品质选择
                auxiliaryQualitySelect.disabled = true;
            }
        }
    }
    
    // 更新武器选择
    function updateWeaponSelect(crateName, quality) {
        if (weaponSelect) {
            weaponSelect.innerHTML = '<option value="">请选择武器</option>';
        }
        if (wearSelect) {
            wearSelect.innerHTML = '<option value="">请选择武器</option>';
        }
        
        if (!crateName || !quality) return;
        
        const crateData = crateDatabase[crateName];
        if (!crateData || !crateData[quality]) return;
        
        if (weaponSelect) {
            for (const weapon of crateData[quality]) {
                const option = document.createElement('option');
                option.value = weapon;
                option.textContent = weapon;
                weaponSelect.appendChild(option);
            }
        }
    }
    
    // 更新外观选择
    function updateWearSelect(weaponName) {
        if (wearSelect) {
            wearSelect.innerHTML = '<option value="">请选择外观</option>';
        }
        if (wearValueInput) {
            wearValueInput.value = '';
            wearValueInput.placeholder = '请选择外观';
            wearValueInput.min = 0;
            wearValueInput.max = 1;
        }
        
        if (!weaponName || !wearSelect) return;
        
        // 从itemCategory中查找武器对应的外观选项
        if (itemCategory && itemCategory[weaponName]) {
            const wearCategories = itemCategory[weaponName];
            for (const wear of wearCategories) {
                const option = document.createElement('option');
                option.value = wear.WearCategory;
                option.textContent = wear.WearCategory;
                wearSelect.appendChild(option);
            }
        }
    }
    
    // 更新磨损值输入框
    function updateWearValueInput(weaponName, wearCategory) {
        if (wearValueInput) {
            
            if (!weaponName || !wearCategory) {
                wearValueInput.value = '';
                wearValueInput.placeholder = '请选择外观';
                wearValueInput.min = 0;
                wearValueInput.max = 1;
                return;
            }
            
            // 从itemCategory中查找武器对应的外观选项
            if (itemCategory && itemCategory[weaponName]) {
                const wearCategories = itemCategory[weaponName];
                for (const wear of wearCategories) {
                    if (wear.WearCategory === wearCategory) {
                        // 更新磨损输入框的属性
                        wearValueInput.placeholder = `(${wear.Min}-${wear.Max})`;
                        wearValueInput.min = wear.Min;
                        wearValueInput.max = wear.Max;
                        // 设置默认值为 Max - 0.001
                        const defaultValue = parseFloat(wear.Max) - 0.001;
                        wearValueInput.value = defaultValue.toFixed(3);
                        break;
                    }
                }
            }
        }
    }
    
    // 处理输入框获得焦点事件
    crateInput.addEventListener('focus', function() {
        const query = this.value.trim();
        const suggestions = getSuggestions(query);
        showDropdown(suggestions);
    });
    
    // 处理输入事件
    crateInput.addEventListener('input', function() {
        const query = this.value.trim();
        const suggestions = getSuggestions(query);
        showDropdown(suggestions);
        
        // 更新联动的输入框
        if (linkedInput) {
            linkedInput.value = this.value;
            // 找到联动输入框对应的品质选择
            const linkedQualityId = linkedInputId.replace('crate-input', 'quality-select');
            const linkedQualitySelect = document.getElementById(linkedQualityId);
            if (linkedQualitySelect) {
                // 清空联动输入框对应的品质选择和武器选择
                linkedQualitySelect.innerHTML = '<option value="">请选择武器箱</option>';
                const linkedWeaponId = linkedInputId.replace('crate-input', 'weapon-select');
                const linkedWeaponSelect = document.getElementById(linkedWeaponId);
                if (linkedWeaponSelect) {
                    linkedWeaponSelect.innerHTML = '<option value="">请选择武器箱</option>';
                }
                const linkedWearId = linkedInputId.replace('crate-input', 'wear-select');
                const linkedWearSelect = document.getElementById(linkedWearId);
                if (linkedWearSelect) {
                    linkedWearSelect.innerHTML = '<option value="">请选择武器</option>';
                }
                const linkedWearValueId = linkedInputId.replace('crate-input', 'wear-value');
                const linkedWearValueInput = document.getElementById(linkedWearValueId);
                if (linkedWearValueInput) {
                    linkedWearValueInput.value = '';
                    linkedWearValueInput.placeholder = '请选择外观';
                    linkedWearValueInput.min = 0;
                    linkedWearValueInput.max = 1;
                }
            }
        }
        

    });
    
    // 处理键盘事件
    crateInput.addEventListener('keydown', function(e) {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                highlightedIndex = (highlightedIndex + 1) % dropdownItems.length;
                highlightItem(highlightedIndex);
                break;
            case 'ArrowUp':
                e.preventDefault();
                highlightedIndex = (highlightedIndex - 1 + dropdownItems.length) % dropdownItems.length;
                highlightItem(highlightedIndex);
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && dropdownItems[highlightedIndex]) {
                    const selectedItem = dropdownItems[highlightedIndex];
                    const itemText = selectedItem.textContent;
                    
                    // 如果是辅料的武器箱输入框，检查选择的武器箱是否包含主料品质的数据
                    if (inputId === 'crate-input-3') {
                        const mainQualitySelect = document.getElementById('quality-select-2');
                        const mainQuality = mainQualitySelect.value;
                        if (mainQuality) {
                            const auxiliaryCrateData = crateDatabase[itemText];
                            if (!auxiliaryCrateData || !auxiliaryCrateData[mainQuality] || auxiliaryCrateData[mainQuality].length === 0) {
                                // 如果武器箱中没有该品质的数据，显示提示信息
                                const auxiliaryQualitySelect = document.getElementById('quality-select-3');
                                if (auxiliaryQualitySelect) {
                                    auxiliaryQualitySelect.innerHTML = '';
                                    const option = document.createElement('option');
                                    option.value = '';
                                    option.textContent = '武器箱中无该品质数据';
                                    option.selected = true;
                                    auxiliaryQualitySelect.appendChild(option);
                                    // 禁用辅料的品质选择
                                    auxiliaryQualitySelect.disabled = true;
                                }
                                return;
                            }
                        }
                    }
                    
                    crateInput.value = itemText;
                    if (linkedInput) {
                        linkedInput.value = itemText;
                        // 找到联动输入框对应的品质选择
                        const linkedQualityId = linkedInputId.replace('crate-input', 'quality-select');
                        const linkedQualitySelect = document.getElementById(linkedQualityId);
                        if (linkedQualitySelect) {
                            // 清空联动输入框对应的品质选择
                            linkedQualitySelect.innerHTML = '<option value="">请选择武器箱</option>';
                            // 从crateDatabase中获取武器箱对应的品质
                            const crateData = crateDatabase[itemText];
                            if (crateData) {
                                for (const quality in crateData) {
                                    if (crateData.hasOwnProperty(quality) && Array.isArray(crateData[quality]) && crateData[quality].length > 0) {
                                        const option = document.createElement('option');
                                        option.value = quality;
                                        option.textContent = qualityMap[quality] || quality;
                                        linkedQualitySelect.appendChild(option);
                                    }
                                }
                            }
                            // 清空联动输入框对应的武器选择和外观选择
                            const linkedWeaponId = linkedInputId.replace('crate-input', 'weapon-select');
                            const linkedWeaponSelect = document.getElementById(linkedWeaponId);
                            if (linkedWeaponSelect) {
                                linkedWeaponSelect.innerHTML = '<option value="">请选择品质</option>';
                            }
                            const linkedWearId = linkedInputId.replace('crate-input', 'wear-select');
                            const linkedWearSelect = document.getElementById(linkedWearId);
                            if (linkedWearSelect) {
                                linkedWearSelect.innerHTML = '<option value="">请选择武器</option>';
                            }
                            const linkedWearValueId = linkedInputId.replace('crate-input', 'wear-value');
                            const linkedWearValueInput = document.getElementById(linkedWearValueId);
                            if (linkedWearValueInput) {
                                linkedWearValueInput.value = '';
                                linkedWearValueInput.placeholder = '请选择外观';
                                linkedWearValueInput.min = 0;
                                linkedWearValueInput.max = 1;
                            }
                        }
                    }
                    
                    // 如果是辅料的武器箱输入框，更新辅料的品质选择
                    if (inputId === 'crate-input-3') {
                        const auxiliaryQualitySelect = document.getElementById('quality-select-3');
                        const mainQualitySelect = document.getElementById('quality-select-2');
                        const mainQuality = mainQualitySelect.value;
                        if (auxiliaryQualitySelect && mainQuality) {
                            auxiliaryQualitySelect.innerHTML = '';
                            const option = document.createElement('option');
                            option.value = mainQuality;
                            option.textContent = qualityMap[mainQuality] || mainQuality;
                            option.selected = true;
                            auxiliaryQualitySelect.appendChild(option);
                            // 禁用辅料的品质选择
                            auxiliaryQualitySelect.disabled = true;
                        }
                    }
                    
                    updateQualitySelect(itemText, inputId);
                    hideDropdown();
                }
                break;
            case 'Escape':
                hideDropdown();
                break;
        }
    });
    
    // 点击外部隐藏下拉列表
    document.addEventListener('click', function(e) {
        if (!crateInput.contains(e.target) && !crateDropdown.contains(e.target)) {
            hideDropdown();
        }
    });
    
    // 清空输入框按钮
    const clearCrateBtn = document.getElementById(clearId);
    if (clearCrateBtn) {
        clearCrateBtn.addEventListener('click', function() {
            crateInput.value = '';
            qualitySelect.innerHTML = '<option value="">请选择武器箱</option>';
            weaponSelect.innerHTML = '<option value="">请选择武器箱</option>';
            wearSelect.innerHTML = '<option value="">请选择武器</option>';
            wearValueInput.value = '';
            wearValueInput.placeholder = '请选择外观';
            wearValueInput.min = 0;
            wearValueInput.max = 1;
            
            if (linkedInput) {
                // 启用联动输入框，设置值后再禁用
                linkedInput.disabled = false;
                linkedInput.value = '';
                linkedInput.disabled = true;
                
                // 找到联动输入框对应的清空按钮并禁用
                const linkedClearId = linkedInputId.replace('crate-input', 'clear-crate');
                const linkedClearBtn = document.getElementById(linkedClearId);
                if (linkedClearBtn) {
                    linkedClearBtn.disabled = true;
                }
                
                // 找到联动输入框对应的品质选择和武器选择
                const linkedQualityId = linkedInputId.replace('crate-input', 'quality-select');
                const linkedWeaponId = linkedInputId.replace('crate-input', 'weapon-select');
                const linkedWearId = linkedInputId.replace('crate-input', 'wear-select');
                const linkedWearValueId = linkedInputId.replace('crate-input', 'wear-value');
                
                const linkedQualitySelect = document.getElementById(linkedQualityId);
                const linkedWeaponSelect = document.getElementById(linkedWeaponId);
                const linkedWearSelect = document.getElementById(linkedWearId);
                const linkedWearValueInput = document.getElementById(linkedWearValueId);
                
                if (linkedQualitySelect) {
                    linkedQualitySelect.innerHTML = '<option value="">请选择武器箱</option>';
                }
                if (linkedWeaponSelect) {
                    linkedWeaponSelect.innerHTML = '<option value="">请选择武器箱</option>';
                }
                if (linkedWearSelect) {
                    linkedWearSelect.innerHTML = '<option value="">请选择武器</option>';
                }
                if (linkedWearValueInput) {
                    linkedWearValueInput.value = '';
                    linkedWearValueInput.placeholder = '请选择外观';
                    linkedWearValueInput.min = 0;
                    linkedWearValueInput.max = 1;
                }
                
                // 如果联动输入框是主料1，还需要清空辅料
                if (linkedInputId === 'crate-input-2') {
                    const materialCrateInput = document.getElementById('crate-input-3');
                    if (materialCrateInput) {
                        materialCrateInput.disabled = false;
                        materialCrateInput.value = '';
                        materialCrateInput.disabled = true;
                    }
                    
                    const materialClearBtn = document.getElementById('clear-crate-3');
                    if (materialClearBtn) {
                        materialClearBtn.disabled = true;
                    }
                    
                    const materialQualitySelect = document.getElementById('quality-select-3');
                    if (materialQualitySelect) {
                        materialQualitySelect.innerHTML = '<option value="">请选择武器箱</option>';
                    }
                }
            }
            
            hideDropdown();
        });
    }
    
    // 品质选择变化事件
    qualitySelect.addEventListener('change', function() {
        const crateName = crateInput.value;
        const quality = this.value;
        updateWeaponSelect(crateName, quality);
        
        // 处理品质联动限制
        if (inputId === 'crate-input-1') {
            // 如果是目标箱子的品质变化，更新主料1的品质选择
            const mainQualitySelect = document.getElementById('quality-select-2');
            if (mainQualitySelect) {
                if (quality) {
                    // 找到当前品质在等级顺序中的索引
                    const qualityIndex = qualityLevels.indexOf(quality);
                    if (qualityIndex > 0) {
                        // 直接赋值主料1的品质为比当前品质低一级的选项
                        const lowerQuality = qualityLevels[qualityIndex - 1];
                        // 清空主料1的品质选择并直接赋值
                        mainQualitySelect.innerHTML = '';
                        const option = document.createElement('option');
                        option.value = lowerQuality;
                        option.textContent = qualityMap[lowerQuality] || lowerQuality;
                        option.selected = true;
                        mainQualitySelect.appendChild(option);
                        // 禁用主料1的品质选择
                        mainQualitySelect.disabled = true;
                        
                        // 更新主料1的武器选择
                        const mainCrateInput = document.getElementById('crate-input-2');
                        if (mainCrateInput) {
                            const mainCrateName = mainCrateInput.value;
                            if (mainCrateName) {
                                const mainWeaponSelect = document.getElementById('weapon-select-2');
                                if (mainWeaponSelect) {
                                    mainWeaponSelect.innerHTML = '<option value="">请选择武器</option>';
                                    const mainCrateData = crateDatabase[mainCrateName];
                                    if (mainCrateData && mainCrateData[lowerQuality]) {
                                        for (const weapon of mainCrateData[lowerQuality]) {
                                            const weaponOption = document.createElement('option');
                                            weaponOption.value = weapon;
                                            weaponOption.textContent = weapon;
                                            mainWeaponSelect.appendChild(weaponOption);
                                        }
                                        // 自动选择主料1的第一个可用武器
                                        if (mainCrateData[lowerQuality].length > 0) {
                                            mainWeaponSelect.value = mainCrateData[lowerQuality][0];
                                            
                                            // 触发武器选择变化事件，更新外观选择
                                            const mainWearSelect = document.getElementById('wear-select-2');
                                            if (mainWearSelect) {
                                                mainWearSelect.innerHTML = '<option value="">请选择武器</option>';
                                                
                                                const selectedWeapon = mainCrateData[lowerQuality][0];
                                                // 从itemCategory中获取该武器的外观分类
                                                if (itemCategory[selectedWeapon]) {
                                                    for (const wearCategory of itemCategory[selectedWeapon]) {
                                                        const wearOption = document.createElement('option');
                                                        wearOption.value = wearCategory.WearCategory;
                                                        wearOption.textContent = wearCategory.WearCategory;
                                                        mainWearSelect.appendChild(wearOption);
                                                    }
                                                    // 自动选择第一个外观分类
                                                    if (itemCategory[selectedWeapon].length > 0) {
                                                        mainWearSelect.value = itemCategory[selectedWeapon][0].WearCategory;
                                                        
                                                        // 更新磨损输入框的范围
                                                        const mainWearValueInput = document.getElementById('wear-value-2');
                                                        if (mainWearValueInput) {
                                                            const firstWear = itemCategory[selectedWeapon][0];
                                                            mainWearValueInput.min = firstWear.Min;
                                                            mainWearValueInput.max = firstWear.Max;
                                                            mainWearValueInput.placeholder = `(${firstWear.Min}-${firstWear.Max})`;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        
                        // 更新辅料的武器箱和品质
                        const materialCrateInput = document.getElementById('crate-input-3');
                        if (materialCrateInput) {
                            // 启用辅料的武器箱输入框，设置值后再启用
                            materialCrateInput.disabled = false;
                            materialCrateInput.value = document.getElementById('crate-input-2').value;
                            
                            // 找到辅料的清空按钮并启用
                            const materialClearBtn = document.getElementById('clear-crate-3');
                            if (materialClearBtn) {
                                materialClearBtn.disabled = false;
                            }
                            
                            // 更新辅料的品质选择
                            const materialQualitySelect = document.getElementById('quality-select-3');
                            if (materialQualitySelect) {
                                // 启用辅料的品质选择框
                                materialQualitySelect.disabled = false;
                                
                                // 清空辅料的品质选择
                                materialQualitySelect.innerHTML = '<option value="">请选择品质</option>';
                                
                                // 从crateDatabase中获取武器箱对应的品质
                                const crateData = crateDatabase[materialCrateInput.value];
                                if (crateData) {
                                    for (const quality in crateData) {
                                        if (crateData.hasOwnProperty(quality) && Array.isArray(crateData[quality]) && crateData[quality].length > 0) {
                                            const option = document.createElement('option');
                                            option.value = quality;
                                            option.textContent = qualityMap[quality] || quality;
                                            materialQualitySelect.appendChild(option);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                
                // 只有在没有自动设置外观选择时才清空
                const mainWearSelect = document.getElementById('wear-select-2');
                if (mainWearSelect && mainWearSelect.options.length <= 1) {
                    mainWearSelect.innerHTML = '<option value="">请选择武器</option>';
                }
                const mainWearValueInput = document.getElementById('wear-value-2');
                if (mainWearValueInput && mainWearValueInput.placeholder === '请选择外观') {
                    mainWearValueInput.value = '';
                    mainWearValueInput.placeholder = '请选择外观';
                    mainWearValueInput.min = 0;
                    mainWearValueInput.max = 1;
                }
            }
        }
    });
    
    // 武器选择变化事件
    if (weaponSelect) {
        weaponSelect.addEventListener('change', function() {
            const weaponName = this.value;
            updateWearSelect(weaponName);
        });
    }
    
    // 外观选择变化事件
    if (wearSelect) {
        wearSelect.addEventListener('change', function() {
            const weaponName = weaponSelect.value;
            const wearCategory = this.value;
            updateWearValueInput(weaponName, wearCategory);
        });
    }
}

// 计算合适的武器
function calculateSuitableWeapons() {
    // 获取第一个武器箱的值
    const crateName1 = document.getElementById('crate-input-1').value;
    const quality1 = document.getElementById('quality-select-1').value;
    const weapon1 = document.getElementById('weapon-select-1').value;
    const wear1 = document.getElementById('wear-select-1').value;
    const wearValueInput1 = document.getElementById('wear-value-1');
    const wearValue1 = wearValueInput1.value;
    
    // 从materialDatabase中获取目标武器的Min和Max
    let wearMin1 = 0;
    let wearMax1 = 1;
    for (const key in materialDatabase) {
        if (materialDatabase.hasOwnProperty(key)) {
            const weaponData = materialDatabase[key];
            if (weaponData.name === weapon1) {
                wearMin1 = parseFloat(weaponData.min);
                wearMax1 = parseFloat(weaponData.max);
                break;
            }
        }
    }
    
    // 获取第二个武器箱的值
    const crateName2 = document.getElementById('crate-input-2').value;
    const quality2 = document.getElementById('quality-select-2').value;
    const weapon2 = document.getElementById('weapon-select-2').value;
    const wear2 = document.getElementById('wear-select-2').value;
    const wearValueInput2 = document.getElementById('wear-value-2');
    const wearValue2 = wearValueInput2.value;
    
    // 从materialDatabase中获取主料武器的Min和Max
    let wearMin2 = 0;
    let wearMax2 = 1;
    for (const key in materialDatabase) {
        if (materialDatabase.hasOwnProperty(key)) {
            const weaponData = materialDatabase[key];
            if (weaponData.name === weapon2) {
                wearMin2 = parseFloat(weaponData.min);
                wearMax2 = parseFloat(weaponData.max);
                break;
            }
        }
    }
    
    // 获取主料数量
    const quantityInput2 = document.getElementById('quantity-input-2');
    const quantity2 = quantityInput2 ? parseInt(quantityInput2.value) : 1;
    
    // 获取辅料的值
    const crateName3 = document.getElementById('crate-input-3').value;
    const quality3 = document.getElementById('quality-select-3').value;
    
    const resultsContainer = document.getElementById('calculator-results');
    const materialInput = document.getElementById('material-input');
    
    // 检查值是否有效
    if (!crateName1 || !quality1 || !weapon1 || !wear1 || !wearValue1 ||
        !crateName2 || !quality2 || !weapon2 || !wear2 || !wearValue2 ||
        !crateName3 || !quality3 ||
        isNaN(wearMin1) || isNaN(wearMax1) || isNaN(wearMin2) || isNaN(wearMax2) ||
        quantity2 <= 0 || quantity2 >= 10) {
        if (materialInput) {
            materialInput.value = '';
        }
        return;
    }
    
    // 计算目标箱子的磨损归一值A
    const A = (parseFloat(wearValue1) - wearMin1) / (wearMax1 - wearMin1);
    
    // 计算主料的磨损归一值B
    const B = (parseFloat(wearValue2) - wearMin2) / (wearMax2 - wearMin2);
    
    // 从crateDatabase中获取辅料的武器列表
    let materialContent = '';
    if (crateDatabase[crateName3] && crateDatabase[crateName3][quality3]) {
        const materialWeapons = crateDatabase[crateName3][quality3];
        
        for (const weapon of materialWeapons) {
            // 从materialDatabase中获取辅料武器的Min和Max
            let materialMin = 0;
            let materialMax = 1;
            // 遍历materialDatabase中的所有武器，找到与当前武器名称匹配的武器数据
            for (const key in materialDatabase) {
                if (materialDatabase.hasOwnProperty(key)) {
                    const weaponData = materialDatabase[key];
                    if (weaponData.name === weapon) {
                        materialMin = parseFloat(weaponData.min);
                        materialMax = parseFloat(weaponData.max);
                        break;
                    }
                }
            }
            
            // 计算辅料的磨损值
            const materialWear = ((A * 10 - B * quantity2) / (10 - quantity2)) * (materialMax - materialMin) + materialMin;
            
            // 确保磨损值在有效范围内
            const clampedWear = Math.max(materialMin, Math.min(materialMax, materialWear));
            
            // 格式化磨损值，保留三位小数
            const formattedWear = clampedWear.toFixed(3);
            
            // 添加到材料内容
            materialContent += `${weapon} ： ${formattedWear}\n`;
        }
    }
    
    // 更新材料输入框
    if (materialInput) {
        materialInput.value = materialContent;
    }
    
    // 清空计算结果容器
    if (resultsContainer) {
        resultsContainer.innerHTML = '';
    }
}

// 获取武器类型名称
function getWeaponTypeName(type) {
    const typeNames = {
        rifle: '步枪',
        pistol: '手枪',
        smg: '冲锋枪',
        sniper: '狙击枪',
        shotgun: '霰弹枪',
        machinegun: '机枪'
    };
    return typeNames[type] || type;
}

// 获取稀有度名称
function getRarityName(rarity) {
    const rarityNames = {
        covert: '隐秘',
        classified: '保密',
        restricted: '受限',
        milspec: '军规级',
        industrial: '工业级',
        consumer: '消费级'
    };
    return rarityNames[rarity] || rarity;
}

// 更新header标题
function updateHeaderTitle(title) {
    const header = document.querySelector('header');
    const searchContainer = document.querySelector('.search-container');
    
    if (!header) return;
    
    // 移除现有的h1标签（如果存在）
    const existingH1 = header.querySelector('h1');
    if (existingH1) {
        existingH1.remove();
    }
    
    // 检查是否是详情页（标题不是'武器箱列表'）
    const isDetailPage = title !== '武器箱列表';
    
    // 在详情页时：显示武器箱名字，隐藏搜索框
    if (isDetailPage) {
        // 创建h1标签显示武器箱名字
        const h1 = document.createElement('h1');
        h1.textContent = title;
        h1.style.color = 'white';
        h1.style.margin = '0';
        h1.style.fontSize = '1.5rem';
        
        // 插入到header的第一个位置
        header.insertBefore(h1, header.firstChild);
        
        // 隐藏搜索框
        if (searchContainer) {
            searchContainer.style.display = 'none';
        }
    } else {
        // 在列表页时：隐藏武器箱名字，显示搜索框
        if (searchContainer) {
            searchContainer.style.display = 'block';
        }
    }
}

// 根据武器名称查找materials-data中的数据
function findWeaponData(weaponName) {
    // 遍历materials-data中的所有武器
    for (const key in materialDatabase) {
        if (materialDatabase.hasOwnProperty(key)) {
            const weaponData = materialDatabase[key];
            // 检查武器名称是否匹配
            if (weaponData.name === weaponName) {
                return weaponData;
            }
        }
    }
    return null;
}

// 显示武器箱列表
function showCrateList(filter = '') {
    // 更新header标题
    updateHeaderTitle('武器箱列表');
    
    // 移除返回按钮
    const backButton = document.querySelector('header .back-button');
    if (backButton) {
        backButton.remove();
    }
    
    const mainElement = document.querySelector('main');
    if (!mainElement) return;
    
    // 重置主内容
    mainElement.innerHTML = '';
    
    // 创建武器箱列表容器
    const crateListElement = document.createElement('div');
    crateListElement.id = 'crate-list';
    crateListElement.className = 'crate-grid';
    mainElement.appendChild(crateListElement);
    
    // 分离普通武器箱和纪念包
    const normalCrates = [];
    const souvenirCrates = [];
    
    for (const crateName in crateDatabase) {
        if (crateDatabase.hasOwnProperty(crateName)) {
            // 应用筛选
            if (filter && !crateName.toLowerCase().includes(filter.toLowerCase())) {
                continue;
            }
            
            if (crateName.includes('纪念包')) {
                //souvenirCrates.push(crateName);
            } else {
                normalCrates.push(crateName);
            }
        }
    }
    
    // 先显示普通武器箱
    normalCrates.forEach(crateName => {
        const crateItem = document.createElement('div');
        crateItem.className = 'crate-item';
        crateItem.innerHTML = `<h2>${crateName}</h2>`;
        
        // 添加点击事件
        crateItem.addEventListener('click', function() {
            // 保存到最近搜索
            saveSearchHistory(crateName);
            window.location.hash = `crate=${encodeURIComponent(crateName)}`;
            showCrateDetail(crateName);
        });
        
        crateListElement.appendChild(crateItem);
    });
    
    // 再显示纪念包
    souvenirCrates.forEach(crateName => {
        const crateItem = document.createElement('div');
        crateItem.className = 'crate-item';
        crateItem.innerHTML = `<h2>${crateName}</h2>`;
        
        // 添加点击事件
        crateItem.addEventListener('click', function() {
            // 保存到最近搜索
            saveSearchHistory(crateName);
            window.location.hash = `crate=${encodeURIComponent(crateName)}`;
            showCrateDetail(crateName);
        });
        
        crateListElement.appendChild(crateItem);
    });
}

// 初始化搜索功能
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchDropdown = document.getElementById('search-dropdown');
    if (!searchInput || !searchDropdown) return;
    
    let highlightedIndex = -1;
    let dropdownItems = [];
    
    // 显示搜索下拉列表
    function showDropdown(history, suggestions) {
        console.log('History array:', history);
        console.log('Suggestions array:', suggestions);
        
        searchDropdown.innerHTML = '';
        dropdownItems = [];
        highlightedIndex = -1;
        
        // 添加历史记录部分
        if (history.length > 0) {
            console.log('Adding history section with', history.length, 'items');
            const historySection = document.createElement('div');
            historySection.className = 'search-dropdown-section';
            historySection.textContent = '最近搜索';
            searchDropdown.appendChild(historySection);
            
            history.forEach(item => {
                console.log('Adding history item:', item);
                const dropdownItem = document.createElement('div');
                dropdownItem.className = 'search-dropdown-item';
                dropdownItem.textContent = item;
                dropdownItem.dataset.type = 'history';
                dropdownItem.addEventListener('click', function() {
                    searchInput.value = item;
                    showCrateList(item);
                    hideDropdown();
                });
                searchDropdown.appendChild(dropdownItem);
                dropdownItems.push(dropdownItem);
            });
        } else {
            console.log('No history items to show');
        }
        
        // 添加自动补全部分
        if (suggestions.length > 0) {
            const suggestionSection = document.createElement('div');
            suggestionSection.className = 'search-dropdown-section';
            suggestionSection.textContent = '自动补全';
            searchDropdown.appendChild(suggestionSection);
            
            suggestions.forEach(item => {
                const dropdownItem = document.createElement('div');
                dropdownItem.className = 'search-dropdown-item';
                dropdownItem.textContent = item;
                dropdownItem.dataset.type = 'suggestion';
                dropdownItem.addEventListener('click', function() {
                    searchInput.value = item;
                    saveSearchHistory(item);
                    showCrateList(item);
                    hideDropdown();
                });
                searchDropdown.appendChild(dropdownItem);
                dropdownItems.push(dropdownItem);
            });
        }
        
        if (dropdownItems.length > 0) {
            searchDropdown.classList.add('show');
        } else {
            hideDropdown();
        }
    }
    
    // 隐藏搜索下拉列表
    function hideDropdown() {
        searchDropdown.classList.remove('show');
        highlightedIndex = -1;
        dropdownItems.forEach(item => item.classList.remove('highlight'));
    }
    
    // 高亮下拉列表项
    function highlightItem(index) {
        dropdownItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('highlight');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('highlight');
            }
        });
    }
    
    // 获取自动补全建议
    function getSuggestions(query) {
        const suggestions = [];
        if (!query) return suggestions;
        
        const lowerQuery = query.toLowerCase();
        
        // 确保crateDatabase存在
        if (!window.crateDatabase) {
            console.error('crateDatabase not found');
            return suggestions;
        }
        
        for (const crateName in window.crateDatabase) {
            if (window.crateDatabase.hasOwnProperty(crateName) && crateName.toLowerCase().includes(lowerQuery)) {
                suggestions.push(crateName);
                if (suggestions.length >= 5) break;
            }
        }
        
        return suggestions;
    }
    
    // 处理输入框获得焦点事件 - 显示最近搜索
    searchInput.addEventListener('focus', function() {
        const query = this.value.trim();
        const history = getSearchHistory();
        const suggestions = getSuggestions(query);
        
        if (query === '') {
            // 输入框为空时，只显示最近搜索
            showDropdown(history, []);
        } else {
            // 输入框有内容时，显示最近搜索和自动补全
            showDropdown(history, suggestions);
        }
    });
    
    // 处理输入事件 - 显示自动补全
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        const history = getSearchHistory();
        const suggestions = getSuggestions(query);
        showDropdown(history, suggestions);
        
        // 当清空搜索框时，显示所有武器箱
        showCrateList(query);
    });
    
    // 检查搜索内容是否匹配任何武器箱
    function isSearchValid(query) {
        if (!query) return false;
        
        const lowerQuery = query.toLowerCase();
        for (const crateName in window.crateDatabase) {
            if (window.crateDatabase.hasOwnProperty(crateName) && crateName.toLowerCase().includes(lowerQuery)) {
                return true;
            }
        }
        return false;
    }
    
    // 处理键盘事件
    searchInput.addEventListener('keydown', function(e) {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                highlightedIndex = (highlightedIndex + 1) % dropdownItems.length;
                highlightItem(highlightedIndex);
                break;
            case 'ArrowUp':
                e.preventDefault();
                highlightedIndex = (highlightedIndex - 1 + dropdownItems.length) % dropdownItems.length;
                highlightItem(highlightedIndex);
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && dropdownItems[highlightedIndex]) {
                    const selectedItem = dropdownItems[highlightedIndex];
                    searchInput.value = selectedItem.textContent;
                    saveSearchHistory(selectedItem.textContent);
                    showCrateList(selectedItem.textContent);
                    hideDropdown();
                } else if (this.value.trim()) {
                    const query = this.value.trim();
                    // 只有当搜索内容匹配任何武器箱时，才保存到历史记录
                    if (isSearchValid(query)) {
                        saveSearchHistory(query);
                    }
                    showCrateList(query);
                    hideDropdown();
                }
                break;
            case 'Escape':
                hideDropdown();
                break;
        }
    });
    
    // 点击外部隐藏下拉列表
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
            hideDropdown();
        }
    });
    
    // 处理搜索提交
    searchInput.addEventListener('blur', function(e) {
        // 延迟隐藏，以便点击下拉项时能触发点击事件
        setTimeout(() => {
            if (!searchDropdown.contains(document.activeElement)) {
                hideDropdown();
            }
        }, 200);
    });
    
    // 处理清空按钮点击事件
    const clearSearchBtn = document.getElementById('clear-search');
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', function() {
            searchInput.value = '';
            showCrateList('');
            const history = getSearchHistory();
            showDropdown(history, []);
        });
        
        // 当输入框有内容时显示清空按钮，否则隐藏
        searchInput.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                clearSearchBtn.style.display = 'block';
            } else {
                clearSearchBtn.style.display = 'none';
            }
        });
        
        // 初始状态：如果输入框为空，隐藏清空按钮
        if (searchInput.value.trim() === '') {
            clearSearchBtn.style.display = 'none';
        }
    }
}

// 保存搜索历史
function saveSearchHistory(item) {
    try {
        let history = getSearchHistory();
        // 移除重复项
        history = history.filter(h => h !== item);
        // 添加到开头
        history.unshift(item);
        // 限制最多5个
        history = history.slice(0, 5);
        localStorage.setItem('searchHistory', JSON.stringify(history));
    } catch (error) {
        console.error('Error saving search history:', error);
    }
}

// 从localStorage获取历史记录
function getSearchHistory() {
    try {
        const history = localStorage.getItem('searchHistory');
        const parsedHistory = history ? JSON.parse(history) : [];
        // 确保返回的是字符串数组，并且过滤掉空字符串
        return Array.isArray(parsedHistory) ? parsedHistory.filter(item => typeof item === 'string' && item.trim() !== '') : [];
    } catch (error) {
        console.error('Error parsing search history:', error);
        return [];
    }
}

// 清除搜索历史
function clearSearchHistory() {
    localStorage.removeItem('searchHistory');
}

// 显示武器箱详情
function showCrateDetail(crateName) {
    // 更新header标题
    updateHeaderTitle(crateName);
    
    const mainElement = document.querySelector('main');
    if (!mainElement) return;
    
    const crateData = crateDatabase[crateName];
    if (!crateData) return;
    
    // 清空主内容
    mainElement.innerHTML = '';
    
    // 创建返回按钮
    const backButton = document.createElement('a');
    backButton.href = '#';
    backButton.className = 'back-button';
    backButton.innerHTML = '←';
    backButton.title = '返回武器箱列表';
    backButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.hash = '';
        showCrateList();
    });
    
    // 将返回按钮插入到header中h1的前面
    const header = document.querySelector('header');
    const headerTitle = document.querySelector('header h1');
    if (header) {
        if (headerTitle) {
            header.insertBefore(backButton, headerTitle);
        } else {
            // 如果没有h1标签，插入到header的第一个位置
            header.insertBefore(backButton, header.firstChild);
        }
    }
    
    
    // 创建武器列表
    const weaponContainer = document.createElement('div');
    mainElement.appendChild(weaponContainer);
    
    // 定义武器等级顺序
    const gradeOrder = ['covert', 'classified', 'restricted', 'milspec', 'ancient', 'industrial', 'consumer'];
    const gradeNames = {
        covert: '隐秘',
        classified: '保密',
        restricted: '受限',
        milspec: '军规级',
        ancient: '远古',
        industrial: '工业级',
        consumer: '消费级'
    };
    
    // 遍历武器等级
    gradeOrder.forEach(grade => {
        if (crateData[grade]) {
            const weapons = crateData[grade];

            weapons.sort((a, b) => {
            // 获取两个武器对应的max值
            const weaponDataA = findWeaponData(a);
            const weaponDataB = findWeaponData(b);
            const maxA = weaponDataA?.max || 0; // 兼容无数据的情况
            const maxB = weaponDataB?.max || 0;

            // 1. max不同：降序排列（大的在前）
                if (maxA !== maxB) {
                    return maxB - maxA;
                } 
                return 0;
            });

            if (weapons.length > 0) {
                const section = document.createElement('div');
                section.className = 'weapon-section';
                
                const sectionTitle = document.createElement('div');
                sectionTitle.className = `section-title ${grade}`;
                sectionTitle.textContent = gradeNames[grade];
                section.appendChild(sectionTitle);
                
                const weaponList = document.createElement('div');
                weaponList.className = 'weapon-list';
                
                // 遍历武器
                weapons.forEach(weaponName => {
                    // 查找武器在materials-data中的数据
                    const weaponData = findWeaponData(weaponName);
                    const minMaxText = weaponData ? `${weaponData.min.toFixed(2)}-${weaponData.max.toFixed(2)}` : '';
                    
                    const weaponItem = document.createElement('div');
                    weaponItem.className = 'weapon-item';
                    if (minMaxText) {
                        weaponItem.innerHTML = `
                            <div class="weapon-info">
                                <span class="weapon-name">${weaponName}</span>
                                <span class="weapon-wear-range">(${minMaxText})</span>
                            </div>
                            <input type="number" class="wear-input" placeholder="0.000" min="0" max="1" step="0.001">
                        `;
                    } else {
                        weaponItem.innerHTML = `
                            <div class="weapon-info">
                                <span class="weapon-name">${weaponName}</span>
                            </div>
                            <input type="number" class="wear-input" placeholder="0.000" min="0" max="1" step="0.001">
                        `;
                    }
                    
                    // 添加输入事件监听
                    const wearInput = weaponItem.querySelector('.wear-input');
                    wearInput.addEventListener('input', function() {
                        const wearValue = parseFloat(this.value);
                        if (!isNaN(wearValue) && wearValue >= 0 && wearValue <= 1) {
                            // 计算同级别其他武器的磨损值
                            calculateOtherWear(weaponList, this, wearValue);
                        }
                    });
                    
                    weaponList.appendChild(weaponItem);
                });
                
                section.appendChild(weaponList);
                mainElement.appendChild(section);
            }
        }
    });
}

// 计算同级别其他武器的磨损值
function calculateOtherWear(weaponList, currentInput, baseWear) {
    // 获取当前武器的磨损范围
    const currentWeaponItem = currentInput.closest('.weapon-item');
    const currentWearRangeElement = currentWeaponItem.querySelector('.weapon-wear-range');
    const currentWearRange = currentWearRangeElement ? currentWearRangeElement.textContent : '';
    
    // 提取当前武器的Min和Max值
    const currentRangeMatch = currentWearRange.match(/\((\d+\.\d+)-(\d+\.\d+)\)/);
    if (!currentRangeMatch) return;
    
    const currentMin = parseFloat(currentRangeMatch[1]);
    const currentMax = parseFloat(currentRangeMatch[2]);
    
    // 计算归一值
    const normalizedValue = (baseWear - currentMin) / (currentMax - currentMin);
    
    // 遍历同级别其他武器
    const weaponItems = weaponList.querySelectorAll('.weapon-item');
    weaponItems.forEach(item => {
        const input = item.querySelector('.wear-input');
        if (input !== currentInput) {
            // 获取其他武器的磨损范围
            const wearRangeElement = item.querySelector('.weapon-wear-range');
            const wearRange = wearRangeElement ? wearRangeElement.textContent : '';
            
            // 提取目标武器的Min和Max值
            const targetRangeMatch = wearRange.match(/\((\d+\.\d+)-(\d+\.\d+)\)/);
            if (targetRangeMatch) {
                const targetMin = parseFloat(targetRangeMatch[1]);
                const targetMax = parseFloat(targetRangeMatch[2]);
                
                // 计算目标武器的磨损值
                let targetWear = normalizedValue * (targetMax - targetMin) + targetMin;
                // 确保最小值为0.001，不会小于0
                targetWear = Math.max(targetWear, 0.001);
                input.value = targetWear.toFixed(3);
            } else {
                // 如果没有磨损范围，留白
                input.value = '';
            }
        }
    });
}