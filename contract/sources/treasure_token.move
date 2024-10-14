module token_drop::treasure_token {
    use std::vector;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::signer;
    use aptos_std::table::{Self, Table};
    use aptos_std::table_with_length;

    struct TokenDrop has store {
        creator: address,
        tokens: Coin<AptosCoin>,
        claims_left: u64,
        addresses_claimed: vector<address>,
        amount_per_claim: u64,
        latitude: u64,
        longitude: u64,
    }

    struct TokenDropState has key {
        drops: table_with_length::TableWithLength<Location, TokenDrop>,
    }

    struct Location has copy, drop, store {
        latitude: u64,
        longitude: u64,
    }

    const GLOBAL_ACCOUNT: address = @0x4bcc4659c742a6fa6c29b75ce56d42fccc3d5e60e0f321c0d8e80f1b133f67e7; // Using a fixed address for the global state

    const ERROR_DROP_NOT_FOUND: u64 = 1;
    const ERROR_NO_CLAIMS_LEFT: u64 = 2;
    const ERROR_ALREADY_CLAIMED: u64 = 3;

    // Global initialization function
    public entry fun initialize(account: &signer) {
        let drops = table_with_length::new();
        let state = TokenDropState { drops };
        move_to(account, state);
    }

    // Add a new token drop
    public entry fun drop_token(
        account: &signer,
        total_amount: u64,
        claims_allowed: u64,
        latitude: u64,
        longitude: u64
    ) acquires TokenDropState {
        let account_addr = signer::address_of(account);
        let amount_per_claim = total_amount / claims_allowed;
        let tokens = coin::withdraw<AptosCoin>(account, total_amount);

        let state = borrow_global_mut<TokenDropState>(GLOBAL_ACCOUNT);
        let location = Location { latitude, longitude };

        let token_drop = TokenDrop {
            creator: account_addr,
            tokens,
            claims_left: claims_allowed,
            addresses_claimed: vector::empty(),
            amount_per_claim,
            latitude,
            longitude,
        };

        table_with_length::add(&mut state.drops, location, token_drop);
    }

    // Claim tokens from a drop
    public entry fun claim_token(
        account: &signer,
        drop_creator: address,
        latitude: u64,
        longitude: u64
    ) acquires TokenDropState {
        let account_addr = signer::address_of(account);
        let state = borrow_global_mut<TokenDropState>(drop_creator);
        let location = Location { latitude, longitude };
        
        assert!(table_with_length::contains(&state.drops, location), ERROR_DROP_NOT_FOUND);
        let drop = table_with_length::borrow_mut(&mut state.drops, location);
        
        assert!(drop.claims_left > 0, ERROR_NO_CLAIMS_LEFT);
        assert!(!vector::contains(&drop.addresses_claimed, &account_addr), ERROR_ALREADY_CLAIMED);
        
        let claim_amount = coin::extract(&mut drop.tokens, drop.amount_per_claim);
        coin::deposit(account_addr, claim_amount);
        
        drop.claims_left = drop.claims_left - 1;
        vector::push_back(&mut drop.addresses_claimed, account_addr);
    }
    // View function to check drop info
    #[view]
    public fun view_drop_info(
        latitude: u64,
        longitude: u64
    ): (u64, u64) acquires TokenDropState {
        let state = borrow_global<TokenDropState>(GLOBAL_ACCOUNT);
        let location = Location { latitude, longitude };

        assert!(table_with_length::contains(&state.drops, location), ERROR_DROP_NOT_FOUND);
        let drop = table_with_length::borrow(&state.drops, location);

        (drop.claims_left, drop.amount_per_claim)
    }
}
